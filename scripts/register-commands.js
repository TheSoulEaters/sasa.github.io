// File: scripts/register-commands.js

// Baris ini memberitahu Node.js untuk memuat variabel dari file .env.local
require('dotenv').config({ path: '.env.local' });

// Ambil kredensial dari environment variables
const appId = process.env.DISCORD_APP_ID;
const botToken = process.env.DISCORD_BOT_TOKEN;

// Periksa apakah kredensial sudah ada
if (!appId || !botToken) {
  throw new Error('Harap set DISCORD_APP_ID dan DISCORD_BOT_TOKEN di .env.local');
}

// Ini adalah daftar semua slash command yang ingin kita daftarkan
const commands = [
  {
    name: 'halo',
    description: 'Menyapa kembali pengguna dengan versi baru.',
  },
  // Jika Anda ingin menambah command lain, tambahkan di sini
  // {
  //   name: 'perintah_lain',
  //   description: 'Deskripsi perintah lain.',
  // },
];

// URL untuk mendaftarkan command ke Discord
const url = `https://discord.com/api/v10/applications/${appId}/commands`;

async function registerCommands() {
  console.log('Mulai mendaftarkan slash commands...');
  try {
    // Kirim data command kita ke Discord menggunakan API
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${botToken}`,
      },
      body: JSON.stringify(commands),
    });

    if (response.ok) {
      console.log('Berhasil mendaftarkan application commands.');
    } else {
      // Jika ada error, tampilkan pesan error dari Discord
      const errorData = await response.json();
      console.error('Gagal mendaftarkan commands:', JSON.stringify(errorData, null, 2));
    }
  } catch (error) {
    // Jika ada error koneksi atau lainnya
    console.error('Terjadi error saat mencoba mendaftar:', error);
  }
}

// Jalankan fungsi pendaftaran
registerCommands(); 