import MenuClient from "./MenuClient";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ tableToken: string }>;
}) {
  const { tableToken } = await params;

  return <MenuClient token={tableToken} />;
}