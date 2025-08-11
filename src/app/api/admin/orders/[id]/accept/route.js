export async function POST(_req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role!=='admin') return NextResponse.json({ message:'Unauthorized' }, { status:401 });
  const { id } = await ctx.params;
  const o = await prisma.order.update({ where:{ id }, data:{ status:'ACCEPTED' }});
  return NextResponse.json(o);
}
