export const coupleSpace = {
  name: "Minh & An",
  spaceName: "Kỷ niệm của chúng mình",
  coverImage:
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
  startDate: "2024-02-14",
  people: [
    {
      id: "u-minh",
      displayName: "Minh",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80"
    },
    {
      id: "u-an",
      displayName: "An",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"
    }
  ],
  bio: "Một nơi riêng để lưu ảnh, ngày, ghi chú và những địa điểm hai đứa đã đi qua.",
  stats: {
    memories: 48,
    places: 36,
    photos: 126,
    daysTogether: 821
  }
};

export const profile = {
  fullName: coupleSpace.spaceName,
  username: "minh-an",
  avatar: coupleSpace.coverImage,
  bio: coupleSpace.bio,
  stats: {
    checkins: coupleSpace.stats.memories,
    places: coupleSpace.stats.places,
    cities: 8,
    photos: coupleSpace.stats.photos
  }
};

export const categories = [
  { id: "coffee", name: "Quán quen", slug: "coffee", icon: "Cafe", color: "#2f7d6f" },
  { id: "food", name: "Bữa ăn", slug: "food", icon: "Meal", color: "#d9654f" },
  { id: "travel", name: "Chuyến đi", slug: "travel", icon: "Trip", color: "#6e63b6" },
  { id: "beach", name: "Biển", slug: "beach", icon: "Sea", color: "#2b8fb8" },
  { id: "mountain", name: "Cột mốc", slug: "mountain", icon: "Milestone", color: "#5e8f4f" },
  { id: "culture", name: "Dạo phố", slug: "culture", icon: "Street", color: "#c28b25" }
];

export const moods = [
  { id: "happy", name: "Vui", slug: "happy", icon: "Smile" },
  { id: "chill", name: "Nhẹ nhàng", slug: "chill", icon: "Calm" },
  { id: "peaceful", name: "Bình yên", slug: "peaceful", icon: "Moon" },
  { id: "memorable", name: "Đáng nhớ", slug: "memorable", icon: "Star" },
  { id: "romantic", name: "Lãng mạn", slug: "romantic", icon: "Heart" },
  { id: "explore", name: "Mới mẻ", slug: "explore", icon: "Compass" }
];

export const journalPrompts = [
  "Điều gì làm nơi này đáng nhớ?",
  "Khoảnh khắc nào muốn giữ lại?",
  "Hai đứa đã nói gì lúc đó?",
  "Có muốn quay lại nơi này không?",
  "Mùi vị, ánh sáng hay âm thanh nào còn nhớ?",
  "Nếu đặt tên cho ngày đó thì là gì?"
];

export const checkins = [
  {
    id: "ck-001",
    title: "Sáng cuối tuần ở Đà Lạt",
    caption:
      "Trời se lạnh, quán nằm trên dốc nhỏ và có mùi thông ướt sau cơn mưa. Hai đứa ngồi rất lâu chỉ để nghe tiếng máy pha cà phê.",
    locationName: "Kokoro Cafe",
    address: "45 Đặng Thái Thân, Phường 3, Đà Lạt",
    city: "Đà Lạt",
    latitude: 11.9365,
    longitude: 108.4419,
    categoryId: "coffee",
    moodId: "peaceful",
    visibility: "private",
    checkinTime: "2026-04-27T08:30:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-001-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
        alt: "Tách cà phê buổi sáng"
      },
      {
        id: "ck-001-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1200&q=80",
        alt: "Góc quán yên tĩnh"
      },
      {
        id: "ck-001-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/6602331/",
        alt: "Cận cảnh tách cà phê trong quán"
      }
    ],
    mapPosition: { x: 45, y: 34 }
  },
  {
    id: "ck-002",
    title: "Hoàng hôn trên Bãi Sau",
    caption:
      "Biển động nhẹ, trời vàng rất chậm. Hai đứa đi bộ dọc bờ kè và chụp được tấm ảnh vẫn còn thích đến giờ.",
    locationName: "Bãi Sau",
    address: "Thùy Vân, Thành phố Vũng Tàu",
    city: "Vũng Tàu",
    latitude: 10.3347,
    longitude: 107.0886,
    categoryId: "beach",
    moodId: "happy",
    visibility: "private",
    checkinTime: "2026-04-12T17:45:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    media: [
      {
        id: "ck-002-img-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        alt: "Bãi biển lúc hoàng hôn"
      },
      {
        id: "ck-002-img-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
        alt: "Sóng biển gần bờ"
      },
      {
        id: "ck-002-video-1",
        type: "video",
        url: "https://www.pexels.com/download/video/8094133/",
        alt: "Sóng biển gần bờ"
      }
    ],
    mapPosition: { x: 63, y: 66 }
  },
  {
    id: "ck-003",
    title: "Cơm tối trong hẻm nhỏ",
    caption:
      "Một bữa tối rất đời thường nhưng đáng nhớ vì món nào cũng vừa miệng. Quán đông, tụi mình ngồi sát cửa và nói chuyện rất lâu.",
    locationName: "Bếp Nhà Lục Tỉnh",
    address: "Quận 3, Thành phố Hồ Chí Minh",
    city: "Hồ Chí Minh",
    latitude: 10.7829,
    longitude: 106.6865,
    categoryId: "food",
    moodId: "memorable",
    visibility: "private",
    checkinTime: "2026-03-30T19:10:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 54, y: 58 }
  },
  {
    id: "ck-004",
    title: "Ngày đầu tiên ở Hội An",
    caption:
      "Phố cổ lên đèn sớm, mọi thứ chuyển sang màu ấm. Tụi mình thích nhất lúc đi qua cầu và nghe tiếng guốc trên nền gạch.",
    locationName: "Phố cổ Hội An",
    address: "Phường Minh An, Hội An, Quảng Nam",
    city: "Hội An",
    latitude: 15.8801,
    longitude: 108.338,
    categoryId: "culture",
    moodId: "romantic",
    visibility: "private",
    checkinTime: "2026-02-18T18:20:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 58, y: 42 }
  },
  {
    id: "ck-005",
    title: "Leo núi nhẹ ở Bà Đen",
    caption:
      "Chuyến đi bắt đầu khá sớm. Lên đến điểm ngắm cảnh thì mây tan dần, nhìn xuống đồng bằng thấy mọi mệt mỏi đều đáng.",
    locationName: "Núi Bà Đen",
    address: "Thạnh Tân, Tây Ninh",
    city: "Tây Ninh",
    latitude: 11.3701,
    longitude: 106.1668,
    categoryId: "mountain",
    moodId: "explore",
    visibility: "private",
    checkinTime: "2026-01-09T06:15:00",
    createdBy: "An",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 38, y: 55 }
  },
  {
    id: "ck-006",
    title: "Cuối ngày trên tàu",
    caption:
      "Một chuyến đi ngắn nhưng có cảm giác như đổi gió thật sự. Ảnh chụp qua cửa sổ tàu bị nhiều hạt mưa bám vào.",
    locationName: "Ga Nha Trang",
    address: "17 Thái Nguyên, Nha Trang, Khánh Hòa",
    city: "Nha Trang",
    latitude: 12.2451,
    longitude: 109.1943,
    categoryId: "travel",
    moodId: "chill",
    visibility: "private",
    checkinTime: "2025-12-22T16:40:00",
    createdBy: "Minh",
    images: [
      "https://images.unsplash.com/photo-1476900543704-4312b78632f8?auto=format&fit=crop&w=1200&q=80"
    ],
    mapPosition: { x: 68, y: 47 }
  }
];

export function getCategory(id) {
  return categories.find((category) => category.id === id) ?? categories[0];
}

export function getMood(id) {
  return moods.find((mood) => mood.id === id) ?? moods[0];
}

export function getMemoryMedia(checkin) {
  if (Array.isArray(checkin.media) && checkin.media.length > 0) {
    return checkin.media;
  }

  return checkin.images.map((image, index) => ({
    id: `${checkin.id}-image-${index + 1}`,
    type: "image",
    url: image,
    alt: checkin.title
  }));
}

export function getCoverMedia(checkin) {
  const media = getMemoryMedia(checkin);
  return media.find((item) => item.type === "image") ?? media[0];
}

export function getCoverImage(checkin) {
  const cover = getCoverMedia(checkin);
  return cover?.type === "video" ? cover.poster : cover?.url;
}

export function getMediaSummary(checkin) {
  const media = getMemoryMedia(checkin);
  const photos = media.filter((item) => item.type === "image").length;
  const videos = media.filter((item) => item.type === "video").length;

  return { total: media.length, photos, videos };
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}
