// File: app/api/interactions/route.js

import { NextResponse } from 'next/server';
import {
  InteractionType,
  InteractionResponseType,
  verifyKey,
} from 'discord-interactions';

export async function POST(request) {
  // Dapatkan data dari request yang dikirim oleh Discord
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const rawBody = await request.text();

  // Verifikasi request untuk memastikan benar-benar datang dari Discord
  const isValid = verifyKey(
    rawBody,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY
  );

  // Jika request tidak valid, kirim error
  if (!isValid) {
    return new NextResponse('Bad request signature', { status: 401 });
  }

  // Ubah data mentah menjadi format JSON yang bisa dibaca
  const interaction = JSON.parse(rawBody);

  // Discord mengirim "PING" untuk memeriksa apakah bot kita aktif
  // Kita harus membalasnya dengan "PONG"
  if (interaction.type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG });
  }

  // Jika interaksi adalah sebuah slash command
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Ambil nama command yang diketik pengguna
    const { name } = interaction.data;

    // Logika untuk merespons command
    if (name === 'halo') {
      return NextResponse.json({
        // Tipe balasan: Kirim pesan di channel
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Isi pesan balasan
          content: `Halo juga, ${interaction.member.user.username}! Selamat datang di bot versi baru!`,
        },
      });
    }
  }

  // Jika ada interaksi lain yang tidak kita kenali
  return new NextResponse('Unknown interaction', { status: 400 });
}