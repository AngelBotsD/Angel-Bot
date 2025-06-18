let handler = async (m, { conn }) => {
  console.log('Mensaje recibido:', JSON.stringify(m, null, 2));
}
handler.command = /^bug$/i;
export default handler;
