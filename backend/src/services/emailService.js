import nodemailer from 'nodemailer';

// Configuration du transporteur Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Template email de base
const emailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #F4F7F6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; }
    .header { background: #0A0F0E; padding: 30px; text-align: center; }
    .logo { color: #0ECFB0; font-size: 24px; font-weight: bold; }
    .slogan { color: #7A9E9B; font-size: 12px; margin-top: 4px; }
    .content { padding: 32px; }
    .title { font-size: 20px; font-weight: bold; color: #0A0F0E; margin-bottom: 12px; }
    .message { color: #5A7270; line-height: 1.6; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: bold; margin-bottom: 20px; }
    .badge-orange { background: #FFF7ED; color: #EA580C; }
    .badge-red { background: #FFF1F2; color: #DC2626; }
    .badge-green { background: #F0FDF4; color: #16A34A; }
    .badge-turquoise { background: #E8FBF8; color: #09A88E; }
    .btn { display: inline-block; background: #0ECFB0; color: #0A0F0E; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; }
    .footer { background: #F4F7F6; padding: 20px; text-align: center; color: #94B0AE; font-size: 12px; }
    .divider { height: 1px; background: #E2EEEC; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Listera</div>
      <div class="slogan">Vendez partout, gérez ici</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      © 2025 Listera — Tous droits réservés<br>
      Cet email a été envoyé automatiquement, merci de ne pas y répondre.
    </div>
  </div>
</body>
</html>
`;

// 1. Email de bienvenue
export const sendWelcomeEmail = async (userEmail, userName) => {
  const content = `
    <div class="badge badge-turquoise">🎉 Bienvenue !</div>
    <div class="title">Bonjour ${userName}, bienvenue sur Listera !</div>
    <div class="message">
      Votre compte a été créé avec succès. Vous pouvez maintenant 
      gérer votre inventaire et publier vos produits sur toutes 
      vos marketplaces depuis une seule interface.
    </div>
    <div class="divider"></div>
    <p style="color:#5A7270;font-size:14px;margin-bottom:20px">
      Commencez par ajouter votre premier produit et connectez 
      vos marketplaces préférées.
    </p>
    <a href="http://localhost:3000/dashboard" class="btn">
      Accéder à mon dashboard →
    </a>
  `;

  await transporter.sendMail({
    from: `"Listera" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🎉 Bienvenue sur Listera !',
    html: emailTemplate(content),
  });
};

// 2. Email stock faible
export const sendLowStockEmail = async (userEmail, userName, productName, quantity) => {
  const content = `
    <div class="badge badge-orange">⚠ Stock faible</div>
    <div class="title">Stock faible détecté</div>
    <div class="message">
      Bonjour ${userName},<br><br>
      Le stock de votre produit <strong>${productName}</strong> 
      est très bas. Il ne reste plus que 
      <strong>${quantity} unité${quantity > 1 ? 's' : ''}</strong>.
      <br><br>
      Pensez à réapprovisionner rapidement pour éviter 
      une rupture de stock et le déréférencement automatique 
      de vos annonces.
    </div>
    <div class="divider"></div>
    <a href="http://localhost:3000/inventory" class="btn">
      Gérer mon inventaire →
    </a>
  `;

  await transporter.sendMail({
    from: `"Listera" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `⚠ Stock faible — ${productName}`,
    html: emailTemplate(content),
  });
};

// 3. Email rupture de stock
export const sendOutOfStockEmail = async (userEmail, userName, productName) => {
  const content = `
    <div class="badge badge-red">🚨 Rupture de stock</div>
    <div class="title">Rupture de stock !</div>
    <div class="message">
      Bonjour ${userName},<br><br>
      Votre produit <strong>${productName}</strong> est 
      <strong>épuisé</strong>. Vos annonces sur toutes les 
      marketplaces ont été <strong>déréférencées automatiquement</strong> 
      pour éviter les surventes.
      <br><br>
      Réapprovisionnez votre stock dès que possible pour 
      remettre vos annonces en ligne.
    </div>
    <div class="divider"></div>
    <a href="http://localhost:3000/products" class="btn">
      Gérer mes produits →
    </a>
  `;

  await transporter.sendMail({
    from: `"Listera" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `🚨 Rupture de stock — ${productName}`,
    html: emailTemplate(content),
  });
};