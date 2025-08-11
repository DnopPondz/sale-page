import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ message:'Unauthorized' }, { status:401 });
  const { paymentMethod='BANK_TRANSFER', shippingInfo=null, notes='' } = await req.json();

  const cart = await prisma.cart.findUnique({
    where:{ userId: s.user.id }, include: { items: true }
  });
  if (!cart || cart.items.length===0) return NextResponse.json({ message:'Empty cart' }, { status:400 });

  const total = cart.items.reduce((sum, i)=> sum + Number(i.unitPriceSnapshot)*i.qty, 0);
  const discount = 0;
  const grandTotal = total - discount;

  const order = await prisma.$transaction(async(tx)=>{
    const o = await tx.order.create({
      data: {
        userId: s.user.id,
        total, discount, grandTotal,
        status: paymentMethod === 'BANK_TRANSFER' ? 'AWAITING_CONFIRMATION' : 'PENDING',
        paymentMethod, paymentStatus: 'UNPAID',
        shippingInfo, notes
      }
    });
    await tx.orderItem.createMany({
      data: cart.items.map(i=>({
        orderId: o.id, productId: i.productId,
        nameSnapshot: i.productId, // เบื้องต้น
        optionSnapshot: i.optionSelections,
        qty: i.qty,
        unitPriceSnapshot: i.unitPriceSnapshot,
        lineTotal: Number(i.unitPriceSnapshot)*i.qty
      }))
    });
    await tx.payment.create({ data: { orderId: o.id, method: paymentMethod }});
    await tx.cartItem.deleteMany({ where: { cartId: cart.id }});
    return o;
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
