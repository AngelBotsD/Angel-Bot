const handler = async (m, { conn }) => {
  const texto = `🐾 *Requisitos y Recompensas de las Batallas de Mascotas* 🐾

🔹 *Batalla 1*:
   • 500 XP  
   • 5 Comida  
   🎁 *Ganas:*  
   • 2x Comida Apostada  
   • 2x XP Apostado  

🔹 *Batalla 2*:
   • 1000 XP  
   • 10 Comida  
   🎁 *Ganas:*  
   • 2x Comida Apostada  
   • 2x XP Apostado  

🔹 *Batalla 3*:
   • 500 XP  
   • 10 Dulces  
   • El nivel del usuario debe ser igual o mayor al de su mascota  
   🎁 *Ganas:*  
   • 2x XP Apostado  
   • 2x Dulces Apostados  

🔹 *Batalla 4*:
   • Apuestas tu mascota y si pierdes, pierde completamente su nivel ☠️  
   🎁 *Ganas:*  
   • Robas el nivel de la mascota rival 

Para desafiar a alguien, usa:  
📌 *batalla <tipo> @usuario*  
Ejemplo: *batalla 1 @usuario*`;

  await m.reply(texto);
};

handler.help = ['batallainfo'];
handler.tags = ['masc'];
handler.command = ['batallainfo'];

export default handler;

