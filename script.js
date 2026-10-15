
// Koneksi ke Supabase
const SUPABASE_URL = "https://zhtyzfjwloxauwbctrno.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iXRAwIbsU0cuv85UUfWULQ_bn242zpb";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("Koneksi Supabase berhasil dibuat.");

const initialSongs = [
  {
    id: 1,
    title: "Goodness of God",
    artist: "Contoh data",
    category: "Worship",
    sections: [
      {
        name: "Verse 1",
        text: "Contoh lirik bagian verse.\nGanti dengan lirik yang digunakan gerejamu."
      },
      {
        name: "Chorus",
        text: "Contoh lirik bagian chorus.\nMasukkan lirik yang sudah kamu miliki."
      }
    ]
  },
  {
    id: 2,
    title: "This Is Amazing Grace",
    artist: "Contoh data",
    category: "Praise",
    sections: [
      {
        name: "Verse 1",
        text: "Contoh lirik bagian verse."
      },
      {
        name: "Chorus",
        text: "Contoh lirik bagian chorus."
      }
    ]
  },
  {
    id: 3,
    title: "Ku Mau Cinta Yesus",
    artist: "Contoh data",
    category: "Worship",
    sections: [
      {
        name: "Verse 1",
        text: "Contoh lirik bagian verse."
      },
      {
        name: "Chorus",
        text: "Contoh lirik bagian chorus."
      }
    ]
  },
  {
    id: 4,
    title: "Hai Mari Berhimpun",
    artist: "Himne tradisional",
    category: "Christmas",
    sections: [
      {
        name: "Lirik",
        text: "Tambahkan lirik himne yang kamu gunakan."
      }
    ]
  }
];


const STORAGE_KEY = "worshipLyricsSongs";

let songs;

try {
  const savedSongs = localStorage.getItem(STORAGE_KEY);

  songs = savedSongs
    ? JSON.parse(savedSongs)
    : initialSongs.map(song => ({
        ...song,
        sections: song.sections.map(section => ({ ...section }))
      }));
} catch (error) {
  console.error("Gagal membaca data lagu:", error);
  songs = initialSongs.map(song => ({
    ...song,
    sections: song.sections.map(section => ({ ...section }))
  }));
}

function saveSongs() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan data lagu:", error);
    alert("Data gagal disimpan. Periksa penyimpanan browser.");
    return false;
  }
}

const songLoading = document.getElementById("songLoading");
const songList = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const totalSongs = document.getElementById("totalSongs");
const totalCategories = document.getElementById("totalCategories");
const emptyMessage = document.getElementById("emptyMessage");
const lyricsPanel = document.getElementById("lyricsPanel");

function initializeDashboard() {
  totalSongs.textContent = songs.length;

  const categories = [...new Set(
    songs.map(song => song.category)
  )];

  totalCategories.textContent = categories.length;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  renderSongs();
}

function renderSongs() {
  const keyword = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  const filteredSongs = songs.filter(song => {
    const matchesTitle =
      song.title.toLowerCase().includes(keyword);

    const matchesCategory =
      selectedCategory === "all" ||
      song.category === selectedCategory;

    return matchesTitle && matchesCategory;
  });

  songList.replaceChildren();

  filteredSongs.forEach(song => {
  const card = document.createElement("div");
  card.className = "song-card";

  const icon = document.createElement("span");
  icon.className = "song-icon";
  icon.textContent = "♫";

  const info = document.createElement("div");
  info.className = "song-info";

  const title = document.createElement("strong");
  title.textContent = song.title;

  const category = document.createElement("span");
  category.textContent = song.category;

  info.append(title, category);

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "action-button";
  openButton.textContent = "Lihat lirik";
  openButton.addEventListener("click", () => {
    showLyrics(song.id);
  });

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "action-button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    editSong(song.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "action-button delete-button";
  deleteButton.textContent = "Hapus";
  deleteButton.addEventListener("click", () => {
    deleteSong(song.id);
  });

  card.append(icon, info, openButton);

  if (isAdmin) {
    card.append(editButton, deleteButton);
  }
  songList.appendChild(card);
  });


  
  if (filteredSongs.length === 0) {
    emptyMessage.hidden = false;

    if (songs.length === 0) {
      emptyMessage.textContent = "Belum ada lagu yang tersedia.";
    } else {
      emptyMessage.textContent =
        "Lagu tidak ditemukan. Coba kata kunci atau kategori lain.";
    }
  } else {
    emptyMessage.hidden = true;
  }

}


let currentFontSize = 18;


function showLyrics(id) {
  const song = songs.find(item => item.id === id);

  if (!song) return;

  document.getElementById("lyricsTitle").textContent =
    song.title;

  document.getElementById("lyricsCategory").textContent =
    song.category;

  document.getElementById("lyricsArtist").textContent =
    song.artist || "Artis tidak dicantumkan";

  const content = document.getElementById("lyricsContent");
  content.replaceChildren();

  song.sections.forEach(section => {
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "lyric-section";

    const heading = document.createElement("h3");
    heading.textContent = section.name;

    const lyrics = document.createElement("p");
    lyrics.textContent = section.text;

    sectionContainer.append(heading, lyrics);
    content.appendChild(sectionContainer);
  });

  content.style.fontSize = currentFontSize + "px";

  document.getElementById("fontSizeLabel").textContent =
    currentFontSize + " px";

  document.getElementById("copyStatus").textContent = "";

  lyricsPanel.hidden = false;
  lyricsPanel.scrollIntoView({ behavior: "smooth" });
}



searchInput.addEventListener("input", renderSongs);
categoryFilter.addEventListener("change", renderSongs);

document.getElementById("closeLyrics").addEventListener(
  "click",
  () => {
    lyricsPanel.hidden = true;
    document.getElementById("lyricsTitle").textContent = "";
    document.getElementById("lyricsContent").replaceChildren();
  }
);

//deklarasi editing song///
let editingSongId = null;
//deklarasi editing song///

const songForm = document.getElementById("songForm");
const addSongButton = document.getElementById("addSongButton");
const cancelAddSong = document.getElementById("cancelAddSong");
let isAdmin = false;
addSongButton.hidden = true;

addSongButton.addEventListener("click", () => {
  songForm.hidden = !songForm.hidden;
});

cancelAddSong.addEventListener("click", () => {
  songForm.reset();
  songForm.hidden = true;
  editingSongId = null;

  songForm.querySelector("h3").textContent = "Tambah Lagu Baru";
  songForm.querySelector('button[type="submit"]').textContent =
    "Simpan Lagu";
});


songForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isAdmin) {
    alert("Silakan login sebagai admin terlebih dahulu.");
    return;
  }

  const title = document.getElementById("songTitle").value.trim();
  const artist = document.getElementById("songArtist").value.trim();
  const category = document.getElementById("songCategory").value;
  const lyricsText = document.getElementById("songLyrics").value.trim();

  if (!title || !lyricsText) {
    alert("Judul dan lirik lagu wajib diisi.");
    return;
  }

  const sections = lyricsText
    .split(/\n(?=Verse\s*\d*:|Chorus:|Bridge:|Pre-Chorus:|Outro:|Intro:)/i)
    .map(section => {
      const separator = section.indexOf("\n");

      if (separator === -1) {
        return {
          name: "Lirik",
          text: section.trim()
        };
      }

      return {
        name: section.slice(0, separator).trim().replace(/:$/, ""),
        text: section.slice(separator + 1).trim()
      };
    })
    .filter(section => section.text);

  const songData = {
    title,
    artist: artist || "Tidak dicantumkan",
    category,
    sections
  };

  const isEditing = editingSongId !== null;
  let result;

  if (isEditing) {
    // Memperbarui lagu yang sudah ada di Supabase
    result = await supabaseClient
      .from("songs")
      .update(songData)
      .eq("id", editingSongId);
  } else {
    // Menambahkan lagu baru ke Supabase
    result = await supabaseClient
      .from("songs")
      .insert([{
        id: Date.now(),
        ...songData
      }]);
  }

  if (result.error) {
    console.error("Gagal menyimpan lagu:", result.error);
    alert("Lagu gagal disimpan. Periksa koneksi dan akses admin.");
    return;
  }

  // Muat ulang daftar lagu dari database online
  await loadSongsFromSupabase();

  searchInput.value = "";
  categoryFilter.value = "all";

  songForm.reset();
  songForm.hidden = true;
  editingSongId = null;

  songForm.querySelector("h3").textContent = "Tambah Lagu Baru";
  songForm.querySelector('button[type="submit"]').textContent =
    "Simpan Lagu";

  alert(
    isEditing
      ? "Perubahan lagu berhasil disimpan!"
      : "Lagu berhasil disimpan ke Database!"
  );
});


//Function untuk Editing Song//

function editSong(id) {
  const song = songs.find(item => item.id === id);

  if (!song) return;

  editingSongId = id;

  document.getElementById("songTitle").value = song.title;
  document.getElementById("songArtist").value = song.artist;
  document.getElementById("songCategory").value = song.category;

  document.getElementById("songLyrics").value =
    song.sections.map(section =>
      section.name + ":\n" + section.text
    ).join("\n\n");

  songForm.querySelector("h3").textContent = "Edit Lagu";
  songForm.querySelector('button[type="submit"]').textContent =
    "Simpan Perubahan";

  songForm.hidden = false;
  songForm.scrollIntoView({ behavior: "smooth" });
}

//Delete Song

async function deleteSong(id) {
  if (!isAdmin) {
    alert("Silakan login sebagai admin terlebih dahulu.");
    return;
  }

  const song = songs.find(item => item.id === id);

  if (!song) return;

  const confirmed = confirm(
    `Yakin ingin menghapus lagu "${song.title}"?`
  );

  if (!confirmed) return;

  const { error } = await supabaseClient
    .from("songs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Gagal menghapus lagu:", error);
    alert("Lagu gagal dihapus. Periksa koneksi dan akses admin.");
    return;
  }

  // Muat ulang data dari database
  await loadSongsFromSupabase();

  // Tutup panel lirik jika lagu yang dihapus sedang dibuka
  const currentTitle =
    document.getElementById("lyricsTitle").textContent;

  if (currentTitle === song.title) {
    lyricsPanel.hidden = true;
    document.getElementById("lyricsTitle").textContent = "";
    document.getElementById("lyricsContent").replaceChildren();
  }

  alert("Lagu berhasil dihapus dari Database!");
}


///Ukuran Tulisan Lirik dan Salin Lirik///

document.getElementById("increaseFont").addEventListener(
  "click",
  () => {
    currentFontSize = Math.min(currentFontSize + 2, 32);

    const content = document.getElementById("lyricsContent");
    content.style.fontSize = currentFontSize + "px";

    document.getElementById("fontSizeLabel").textContent =
      currentFontSize + " px";
  }
);

document.getElementById("decreaseFont").addEventListener(
  "click",
  () => {
    currentFontSize = Math.max(currentFontSize - 2, 12);

    const content = document.getElementById("lyricsContent");
    content.style.fontSize = currentFontSize + "px";

    document.getElementById("fontSizeLabel").textContent =
      currentFontSize + " px";
  }
);

document.getElementById("copyLyrics").addEventListener(
  "click",
  async () => {
    const title =
      document.getElementById("lyricsTitle").textContent;

    const artist =
      document.getElementById("lyricsArtist").textContent;

    const content = document.getElementById("lyricsContent");

    const text = [
      title,
      artist,
      "",
      ...[...content.querySelectorAll(".lyric-section")].map(
        section => {
          const heading = section.querySelector("h3").textContent;
          const lyrics = section.querySelector("p").textContent;

          return heading + "\n" + lyrics;
        }
      )
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);

      document.getElementById("copyStatus").textContent =
        "Lirik berhasil disalin!";
    } catch (error) {
      document.getElementById("copyStatus").textContent =
        "Gagal menyalin. Coba buka website melalui Live Server.";
    }
  }
);

//Baca table songs dari supabase



async function loadSongsFromSupabase() {
  songLoading.hidden = false;
  console.log("Mengambil data lagu dari Supabase...");

  const { data, error } = await supabaseClient
    .from("songs")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Gagal memuat lagu dari Supabase:", error);

    alert(
      "Lagu gagal dimuat dari database. Periksa koneksi internet dan coba muat ulang halaman."
    );
    songLoading.hidden = true;
    return;
  }

  // Gunakan data dari database sebagai sumber utama
  songs = data;

  // Perbarui cadangan lokal
  saveSongs();

  // Bersihkan pilihan kategori lama agar tidak duplikat
  categoryFilter.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Semua Kategori";
  categoryFilter.appendChild(allOption);

  initializeDashboard();

  console.log("Lagu berhasil dimuat dari Supabase:", songs.length);
  songLoading.hidden = true;
}


loadSongsFromSupabase();

//Tombol Login Admin

const adminLoginButton = document.getElementById("adminLoginButton");
const adminLoginForm = document.getElementById("adminLoginForm");
const cancelAdminLogin = document.getElementById("cancelAdminLogin");
const adminLoginStatus = document.getElementById("adminLoginStatus");
const adminLoggedIn = document.getElementById("adminLoggedIn");
const adminLogoutButton = document.getElementById("adminLogoutButton");
const adminEmailInput = document.getElementById("adminEmail");
const adminPasswordInput = document.getElementById("adminPassword");

// Membuka dan menutup form login
adminLoginButton.addEventListener("click", () => {
  adminLoginForm.hidden = !adminLoginForm.hidden;
  adminLoginStatus.textContent = "";
});

cancelAdminLogin.addEventListener("click", () => {
  adminLoginForm.hidden = true;
  adminLoginStatus.textContent = "";
});

// Memeriksa apakah akun terdaftar sebagai admin
async function updateAdminUI(session) {
  isAdmin = false;

  if (session?.user) {
    const { data, error } = await supabaseClient
      .from("worship_admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Gagal memeriksa admin:", error);
      adminLoginStatus.textContent =
        "Gagal memeriksa akses admin. Periksa konfigurasi Supabase.";
      return;
    }

    isAdmin = Boolean(data);
  }

  if (session?.user && !isAdmin) {
    await supabaseClient.auth.signOut();
    adminLoginStatus.textContent =
      "Akun ini belum terdaftar sebagai admin.";
  }

  adminLoginButton.hidden = isAdmin;
  adminLoginForm.hidden = true;
  adminLoggedIn.hidden = !isAdmin;

  if (isAdmin) {
    adminLoggedIn.querySelector("p").textContent =
      "Login sebagai admin: " + session.user.email;
  }
addSongButton.hidden = !isAdmin;
renderSongs();
}

// Proses login
adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  adminLoginStatus.textContent = "Sedang memeriksa akun...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: adminEmailInput.value.trim(),
    password: adminPasswordInput.value
  });

  if (error) {
    console.error("Login gagal:", error);
    adminLoginStatus.textContent =
      "Login gagal. Periksa email dan password.";
    return;
  }

  adminPasswordInput.value = "";

  await updateAdminUI(data.session);

  if (adminLoggedIn.hidden) {
    adminLoginStatus.textContent =
      "Akun berhasil diautentikasi, tetapi akses admin belum terverifikasi.";
  } else {
    adminLoginStatus.textContent = "";
  }
});

// Proses logout
adminLogoutButton.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("Logout gagal:", error);
    adminLoginStatus.textContent = "Logout gagal. Silakan coba lagi.";
    return;
  }

  adminLoggedIn.hidden = true;
  adminLoginButton.hidden = false;
  adminLoginForm.hidden = true;
  adminLoginStatus.textContent = "";
});

// Memulihkan status login saat halaman dibuka kembali
supabaseClient.auth.onAuthStateChange((_event, session) => {
  setTimeout(() => {
    updateAdminUI(session);
  }, 0);
});

supabaseClient.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("Gagal memeriksa sesi:", error);
    return;
  }

  updateAdminUI(data.session);
});

