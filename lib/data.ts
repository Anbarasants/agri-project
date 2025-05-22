interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  colors: string[];
  stock: number;
  topSelling?: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Tractor Cultivator",
    description:
      "Heavy-duty cultivator for efficient soil preparation. Features adjustable tines and durable construction for long-lasting performance.",
    price: 45000,
    images: [
      "https://mlhobevaucyf.i.optimole.com/w:1200/h:742/q:mauto/f:best/ig:avif/https://newagri.in/wp-content/uploads/2023/06/AG204_9_Tyne_cultivator.jpg",
      "https://5.imimg.com/data5/SELLER/Default/2022/8/WC/QL/PU/15645156/13-tines-tractor-cultivator.jpg",
      "https://assets.tractorjunction.com/tractor-junction/assets/images/images/implementTractor/extra-heavy-duty-tiller-36-1659177158.png?format=webp",
      "https://images.jdmagicbox.com/quickquotes/images_main/9-tynes-rigid-loaded-tractor-cultivator-2216880290-3osnelg1.jpg",
    ],
    category: "Cultivators",
    colors: ["Red", "Blue", "Green"],
    stock: 15,
    topSelling: true,
  },
  {
    id: "p2",
    name: "Power Tiller",
    description:
      "Versatile power tiller with adjustable tilling width and depth. Perfect for small to medium farms and gardens.",
    price: 65000,
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXLSdaGGpIlfdYvqNiYKjMyU129SP7degiBA&s",
      "https://naturetouch.co.in/wp-content/uploads/2021/11/kubota-pem140di-power-tilleR1.jpg",
      "https://international.sonalika.com/wp-content/uploads/2023/04/5-min-12.png",
      "https://newagro.net/wp-content/uploads/2018/09/Kirloskar-Mega-T-12-Power-Tillers.jpg",
    ],
    category: "Tillers",
    colors: ["Red", "Black"],
    stock: 8,
    topSelling: true,
  },
  {
    id: "p3",
    name: "Seed Drill",
    description:
      "Precision seed drill for accurate seed placement. Adjustable row spacing and depth control for optimal planting results.",
    price: 38000,
    images: [
      "https://5.imimg.com/data5/SELLER/Default/2023/12/367520477/YP/SG/PW/2497808/seed-drills-9-tyne.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRLIMnqBP69WFMRbdbVR_oYmbxndQK4WSDvA&s",
      "https://khetigaadi.com/blog/wp-content/uploads/2022/04/MicrosoftTeams-image-2022-04-23T102809.008.jpg",
      "https://ksagrotech.org/wp-content/uploads/2022/01/Zero-Seed-Drill.jpg",
    ],
    category: "Seeders",
    colors: ["Green", "Yellow", "Red"],
    stock: 12,
  },
  {
    id: "p4",
    name: "Rotary Tiller",
    description:
      "Efficient rotary tiller for soil preparation. Features adjustable working width and depth for versatile operation.",
    price: 55000,
    images: [
      "https://5.imimg.com/data5/SELLER/Default/2024/2/390258448/OY/IM/RK/14136357/rotary-tiller-machine.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsoxLsjkr1bCitUgD-vRIQ8_fHmCEVfspny-xyubxW67Jvp5rj7KKyESex--jBG9KSQYA&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5wrsnPTWyz91kRXkR09UfCnU_XC_8pArzhw&s",
      "https://www.rotarytiller-factory.com/uploads/WYF_3322.jpg",
    ],
    category: "Tillers",
    colors: ["Red", "Blue"],
    stock: 10,
    topSelling: true,
  },
  {
    id: "p5",
    name: "Sprinkler System",
    description:
      "Advanced sprinkler system for efficient irrigation. Covers large areas with adjustable spray patterns and water flow.",
    price: 28000,
    images: [
      "https://cdn11.bigcommerce.com/s-tjrce8etun/product_images/uploaded_images/sprinkler-with-rotary.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDC0uwTrXeOG5C-VyKanW04wgvSwOu16TcvDA7hk5cciPhk4MKpvxW207hggs9aPqr9sg&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaRFVocafM5FD8EkqQzCQlyVrw4yY19ip_8HKdQaxwC4mt0e6xY0d1JyU_d0FLcBREPpU&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjYHJj1Z9pUKXimPmvHb2b1Xkf2viSk7bHH2VGctzzTyzjtR82dleWI5-x6Wv6OA1GYBc&usqp=CAU",
    ],
    category: "Irrigation",
    colors: ["Blue", "Green"],
    stock: 20,
  },
  {
    id: "p6",
    name: "Fertilizer Spreader",
    description:
      "Precision fertilizer spreader for even distribution. Adjustable spread width and rate for efficient application.",
    price: 32000,
    images: [
      "https://s3.toolsvilla.com/products/Heavy%20Duty%20Tractor%20Operated%20Fertilizer%20Spreader%20/1589341515991fertilizerspreader.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKDpcTkr2Ra_CVg970O_gj095YYUFD7LiS8XiwmML7vC_iDjTXUuEDZx9C6RSQOMlUW8&usqp=CAU",
      "https://products.blains.com/600/111/1113381.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKevwI0-Xgz2f2TUqdsLmAI6aH6LEt0J51cFOqhE5QuAlqpFt7RB01pvCSEODoN3rMUEY&usqp=CAU",
    ],
    category: "Fertilizers",
    colors: ["Yellow", "Green", "Red"],
    stock: 15,
  },
  {
    id: "p7",
    name: "Harvester Attachment",
    description:
      "Versatile harvester attachment for various crops. Compatible with most tractor models for efficient harvesting.",
    price: 75000,
    images: [
      "https://5.imimg.com/data5/ANDROID/Default/2024/7/438632438/ZY/MD/UT/4257088/product-jpeg-500x500.jpg",
      "https://tiimg.tistatic.com/fp/1/008/626/corn-silage-forage-harvester-tractor-attachment-machine-576.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5drDzuiiVdj7Iu4zadQg5VKW9EWlCWu7PUlxhs8R1qBQNHGczUxK3msP2Y_iBNML3r3c&usqp=CAU",
      "https://5.imimg.com/data5/ANDROID/Default/2024/11/463796259/WN/IW/AC/82137236/product-jpeg-500x500.jpg",
    ],
    category: "Harvesters",
    colors: ["Red", "Yellow"],
    stock: 5,
    topSelling: true,
  },
  {
    id: "p8",
    name: "Water Pump",
    description:
      "High-capacity water pump for irrigation needs. Durable construction with efficient motor for reliable operation.",
    price: 18000,
    images: [
      "https://m.media-amazon.com/images/I/71vOJ8FGUjL.jpg",
      "https://5.imimg.com/data5/SELLER/Default/2021/4/LJ/MD/SQ/4385243/d9oxo9m5giy017r7qoi88-500x500.jpeg",
      "https://5.imimg.com/data5/SELLER/Default/2024/4/412067831/RE/BF/DD/214737066/compressjpeg-online-image-2-jpg-250x250.jpg",
      "https://5.imimg.com/data5/SELLER/Default/2023/9/341504580/IU/QQ/SQ/146443260/81becl8fcul-sl1500-500x500.jpg",
    ],
    category: "Irrigation",
    colors: ["Blue", "Black"],
    stock: 25,
  },
  {
    id: "p9",
    name: "Disc Harrow",
    description:
      "Heavy-duty disc harrow for soil preparation. Adjustable disc angle and spacing for optimal performance.",
    price: 42000,
    images: [
      "https://www.fieldking.com/images/tillage/harrow/lg/mounted-offset-disc-harrow.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTibZLqWVpcRsFO80ieRuaXHzNa94HwF5oEkniZDXac0nshOnCeHlknDIaiSinppG_eu7M&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgp4Ni435e8UEYKYIJVR1PRCz3bmWw8bnAtkjiVPq-YijTo7WuCO9hvMm-0ZnG8qicdh0&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf7WkhNQRZllreJVmxSAw1cgjV997m012KULv9G1l11kM14hG9gnEywudM_tArsBe_9xk&usqp=CAU",
    ],
    category: "Cultivators",
    colors: ["Red", "Green"],
    stock: 10,
  },
  {
    id: "p10",
    name: "Pesticide Sprayer",
    description:
      "Precision pesticide sprayer with adjustable nozzles. Large capacity tank for extended operation without refilling.",
    price: 25000,
    images: [
      "https://5.imimg.com/data5/SELLER/Default/2023/12/367519649/KG/JN/WS/2497808/agricultural-sprayer-2-in-1-dual-type-500x500.jpg",
      "https://cdn.salla.sa/pGZrN/9faa51b0-f9a1-4b67-bab8-e7c801495c17-1000x1000-pT0bOh0TSYK3juGwF9udZK54wByGKcOeEeITWyNk.png",
      "https://images.jdmagicbox.com/quickquotes/images_main/-gnvu6wp8.jpg",
      "https://5.imimg.com/data5/IL/CQ/MY-51623870/agro-spray-pump-500x500.jpg",
    ],
    category: "Sprayers",
    colors: ["Green", "Yellow", "Blue"],
    stock: 18,
  },
  {
    id: "p11",
    name: "Thresher Machine",
    description:
      "Efficient thresher machine for grain separation. High capacity with minimal grain damage for quality output.",
    price: 58000,
    images: [
      "https://mlhobevaucyf.i.optimole.com/w:1200/h:783/q:mauto/f:best/ig:avif/https://newagri.in/wp-content/uploads/2023/06/AG401_maize_thresher_1.jpg",
      "https://s3.toolsvilla.com/products/Heavy%20Duty%20Commercial%20Multi%20Crop%20Threshing%20Machine%203%20Fan%20to%207%20Fan/1588762161156WhatsApp%20Product%2020200502%20at%2010.33.32min.jpeg",
      "https://5.imimg.com/data5/NT/TE/CK/SELLER-36743320/paddy-thresher-500x500.jpg",
      "https://5.imimg.com/data5/SELLER/Default/2024/8/446890975/HC/QK/CB/11548670/single-fan-wheat-thresher-machine.png",
    ],
    category: "Harvesters",
    colors: ["Red", "Yellow"],
    stock: 7,
    topSelling: true,
  },
  {
    id: "p12",
    name: "Plough Set",
    description:
      "Versatile plough set for various soil types. Adjustable depth and width for optimal soil turning and preparation.",
    price: 35000,
    images: [
      "https://5.imimg.com/data5/SELLER/Default/2023/1/BR/ZZ/EF/159919211/reversible-disc-plough-angle-set-500x500.png",
      "https://5.imimg.com/data5/SELLER/Default/2023/7/327727841/GF/NH/MH/6422569/iron-steel-disc-plough-250x250.png",
      "https://5.imimg.com/data5/BX/EP/MY-29780301/tractor-disc-plough.jpg",
      "https://4.imimg.com/data4/MH/KM/MY-12671948/automatic-disc-plough.jpg",
    ],
    category: "Cultivators",
    colors: ["Red", "Black", "Green"],
    stock: 15,
  },
]
