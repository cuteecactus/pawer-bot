import { EmbedBuilder, PermissionsBitField } from "discord.js";

export async function setNickLogic({ guild, executor, target, nickname }) {
  // Permission check
  if (!executor.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
    return {
      ok: false,
      message: "❌ You need **Manage Nicknames** permission."
    };
  }

  // Owner protection
  if (target.id === guild.ownerId) {
    return {
      ok: false,
      message: "❌ You cannot change the server owner's nickname."
    };
  }

  // Role hierarchy checks
  if (
    executor.roles.highest.position <= target.roles.highest.position &&
    guild.ownerId !== executor.id
  ) {
    return {
      ok: false,
      message: "❌ You cannot change the nickname of someone with an equal or higher role."
    };
  }

  if (
    guild.members.me.roles.highest.position <= target.roles.highest.position
  ) {
    return {
      ok: false,
      message: "❌ My role is not high enough to change this user's nickname."
    };
  }

  try {
    await target.setNickname(
      nickname || null,
      `Nickname changed by ${executor.user.tag}`
    );

    const embed = new EmbedBuilder()
      .setTitle("✏️ Nickname Updated")
      .setDescription(
        nickname
          ? `**${target.user.tag}** is now **${nickname}**`
          : `Nickname for **${target.user.tag}** has been reset`
      )
      .addFields({ name: "Moderator", value: executor.user.tag, inline: true })
      .setColor("Purple")
      .setTimestamp();

    return { ok: true, embed };
  } catch (err) {
    return {
      ok: false,
      message: "❌ Failed to update nickname: " + err.message
    };
  }
}
