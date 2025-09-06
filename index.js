import { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// ID ของช่องต่าง ๆ
const MAIN_CHANNEL_ID = "1404827113902706829"; // ช่องส่งเมนูชั้นปี
const CONFIRM_CHANNEL_ID = "1404827116553506940"; // ช่องส่งข้อความยืนยัน

// Role ชั้นปี
const GRADE_ROLES = {
  vch1: "1256974872672866395",
  vch2: "1413550571163746304",
  vch3: "1413550056212004874",
  vws1: "1413564289238962259",
  vws2: "1413564462094614799",
  vws3: "1413724554991505608"
};

// Role สาขา
const MAJOR_ROLES = {
  prog: "1413730630897766400",
  elec: "1413731080455983234",
  auto: "1413732623792078968",
  fd: "1413731216850423828",
  gt: "1413731793810751628",
  bh: "1413732623792078968",
  pn: "1413732267922161684",
  st: "1413733486346506300",
  tt: "1413733890438336573",
  tg: "1413735235996225578",
  tgb: "1413732463963799715",
  kjk: "1413736230537003028",
  p: "1413735994154287185",
  kjp: "1413736563010965605",
  ob: "1413735613743763456",
  kpp: "1413736976212824095",
};

// เมื่อบอทพร้อม
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(MAIN_CHANNEL_ID);
  if (!channel) return console.error("ไม่พบช่องหลัก");

  const embed = new EmbedBuilder()
    .setTitle("🎓 เลือกชั้นปีของคุณ")
    .setDescription("กรุณาเลือกชั้นปีของคุณจากเมนูด้านล่าง")
    .setColor(0x00ff00)
    .setImage("https://img5.pic.in.th/file/secure-sv1/KVC-COMMUNITY-0.1eb36bce4ca59c1fc.gif")
    .setFooter({ text: "KVC Discord Bot" });

  const gradeMenu = new StringSelectMenuBuilder()
    .setCustomId("select-grade")
    .setPlaceholder("เลือกชั้นปีของคุณ")
    .addOptions([
      { label: "ปวช.1", value: "vch1", emoji: "🎓" },
      { label: "ปวช.2", value: "vch2", emoji: "🎓" },
      { label: "ปวช.3", value: "vch3", emoji: "🎓" },
      { label: "ปวส.1", value: "vws1", emoji: "🎓" },
      { label: "ปวส.2", value: "vws2", emoji: "🎓" },
      { label: "ปวส.3", value: "vws3", emoji: "🎓" },
    ]);

  const resetButton = new ButtonBuilder()
    .setCustomId("reset-roles")
    .setLabel("รีเซ็ตชั้นปี/สาขา")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder().addComponents(gradeMenu);
  const buttonRow = new ActionRowBuilder().addComponents(resetButton);

  await channel.send({ embeds: [embed], components: [row, buttonRow] });
});

// จัดการ Interaction
client.on("interactionCreate", async interaction => {
  if (!interaction.isStringSelectMenu() && !interaction.isButton()) return;
  const user = interaction.user;

  // เลือกชั้นปี
  if (interaction.isStringSelectMenu() && interaction.customId === "select-grade") {
    const grade = interaction.values[0];
    try {
      const member = await interaction.guild.members.fetch(user.id);
      const roleId = GRADE_ROLES[grade];
      if (roleId) await member.roles.add(roleId);
      console.log(`เพิ่มยศชั้นปี ${roleId} ให้ ${user.tag}`);
    } catch (err) {
      console.error("ไม่สามารถเพิ่มยศชั้นปีได้:", err);
    }

    const embed = new EmbedBuilder()
      .setTitle("💻 เลือกสาขาของคุณ")
      .setDescription(`คุณเลือกชั้นปี: ${grade}\nตอนนี้เลือกสาขาของคุณ`)
      .setColor(0x00ff00)
      .setImage("https://img5.pic.in.th/file/secure-sv1/KVC-COMMUNITY-0.1eb36bce4ca59c1fc.gif")
      .setFooter({ text: "KVC Discord Bot" });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select-major")
        .setPlaceholder("เลือกสาขาของคุณ")
        .addOptions([
          { label: "โปรแกรมเมอร์", value: "prog", emoji: "💻" },
          { label: "การโรงแรม", value: "elec", emoji: "🏨" },
          { label: "กราฟิก", value: "auto", emoji: "🎨" },
          { label: "อาหารและโภชนาการ", value: "fd", emoji: "🍳" },
          { label: "การตลาด", value: "gt", emoji: "📈" },
          { label: "บัญชี", value: "bh", emoji: "📊" },
          { label: "วิจิตรศิลป", value: "pn", emoji: "🖌️" },
          { label: "สารสนเทศ", value: "st", emoji: "💾" },
          { label: "ท่องเที่ยวฯ", value: "tt", emoji: "✈️" },
          { label: "ธุรกิจดิจิทัล", value: "tg", emoji: "🖥️" },
          { label: "ธุรกิจการบิน/บริการภาคพื้น", value: "tgb", emoji: "🛫" },
          { label: "การจัดการสำนักงาน", value: "kjk", emoji: "🏢" },
          { label: "ผ้าและเครื่องแต่งกาย", value: "p", emoji: "👗" },
          { label: "การจัดประชุมและนิทรรศการ", value: "kjp", emoji: "📅" },
          { label: "ออกแบบ", value: "ob", emoji: "✏️" },
          { label: "ค้าปลีก", value: "kpp", emoji: "🛍️" },
        ])
    );

    // ส่งข้อความแบบส่วนตัว (ephemeral)
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  // เลือกสาขา
  if (interaction.isStringSelectMenu() && interaction.customId === "select-major") {
    const major = interaction.values[0];
    try {
      const member = await interaction.guild.members.fetch(user.id);
      const roleId = MAJOR_ROLES[major];
      if (roleId) await member.roles.add(roleId);
      console.log(`เพิ่มยศสาขา ${roleId} ให้ ${user.tag}`);
    } catch (err) {
      console.error("ไม่สามารถเพิ่มยศสาขาได้:", err);
    }

    const embedMain = new EmbedBuilder()
      .setTitle("✅ คุณเลือกเสร็จแล้ว")
      .setDescription(`คุณเลือกสาขา: ${major}`)
      .setColor(0x00ff00)
      .setImage("https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif")
      .setFooter({ text: "KVC Discord Bot" });

    // ส่งข้อความแบบส่วนตัว (ephemeral)
    await interaction.reply({ embeds: [embedMain], components: [], ephemeral: true });

    // ส่งไปช่องยืนยันตัวตน (ยังเป็นสาธารณะ)
    const confirmChannel = await client.channels.fetch(CONFIRM_CHANNEL_ID);
    if (confirmChannel) {
      const embedConfirm = new EmbedBuilder()
        .setTitle("🎉 ยืนยันตัวตนสำเร็จ")
        .setDescription(`${user} ได้ทำการยืนยันตัวตนเรียบร้อยแล้ว!\nสาขา: ${major}`)
        .setColor(0x00ff00)
        .setImage("https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif")
        .setFooter({ text: "KVC Discord Bot" });
      confirmChannel.send({ embeds: [embedConfirm] });
    }
  }

  // รีเซ็ตชั้นปี/สาขา
  if (interaction.isButton() && interaction.customId === "reset-roles") {
    try {
      const member = await interaction.guild.members.fetch(user.id);
      // ลบ Role ชั้นปี
      for (const roleId of Object.values(GRADE_ROLES)) {
        if (member.roles.cache.has(roleId)) await member.roles.remove(roleId);
      }
      // ลบ Role สาขา
      for (const roleId of Object.values(MAJOR_ROLES)) {
        if (member.roles.cache.has(roleId)) await member.roles.remove(roleId);
      }
      await interaction.reply({ 
        content: "♻️ คุณได้รีเซ็ตชั้นปีและสาขาเรียบร้อยแล้ว!", 
        ephemeral: true 
      });
    } catch (err) {
      console.error("ไม่สามารถรีเซ็ตยศได้:", err);
      await interaction.reply({ 
        content: "❌ เกิดข้อผิดพลาดในการรีเซ็ตยศ", 
        ephemeral: true 
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
