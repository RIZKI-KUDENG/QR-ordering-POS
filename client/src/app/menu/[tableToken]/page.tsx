import MenuClient from "./MenuClient";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ tabletoken: string }>;
}) {
  const { tabletoken } = await params;

  return <MenuClient token={tabletoken} />;
}