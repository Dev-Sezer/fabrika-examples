"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Box, Cylinder, Sphere } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { Mesh, AmbientLight, DirectionalLight } from "three";

// Işıklandırma bileşeni - Three.js lights'ı sahneye ekler
function Lighting() {
  const { scene } = useThree();
  
  useEffect(() => {
    // Ambient light - genel aydınlatma
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Directional light 1 - ana ışık kaynağı
    const directionalLight1 = new DirectionalLight(0xffffff, 1.2);
    directionalLight1.position.set(20, 20, 10);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);
    
    // Directional light 2 - ikincil ışık
    const directionalLight2 = new DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-20, 15, -10);
    scene.add(directionalLight2);
    
    return () => {
      // Cleanup - bileşen unmount olduğunda ışıkları kaldır
      scene.remove(ambientLight);
      scene.remove(directionalLight1);
      scene.remove(directionalLight2);
    };
  }, [scene]);
  
  return null; // Bu bileşen görsel render etmez
}

// Hareket eden kutu bileşeni - fabrikada taşınan ürünleri temsil eder
function HareketEdenKutu({
  position,
  hedef,
}: {
  position: [number, number, number];
  hedef: [number, number, number];
}) {
  const meshRef = useRef<Mesh>(null);
  const [aktifPozisyon, setAktifPozisyon] = useState(position);

  useEffect(() => {
    // Her 100ms'de bir kutunun pozisyonunu değiştir
    const interval = setInterval(() => {
      setAktifPozisyon((prev) => [
        prev[0] + (hedef[0] - prev[0]) * 0.05, // X ekseninde yavaşça hareket et
        prev[1],
        prev[2] + (hedef[2] - prev[2]) * 0.05, // Z ekseninde yavaşça hareket et
      ]);
    }, 100);

    return () => clearInterval(interval);
  }, [hedef]);

  return (
    <Box
      ref={meshRef}
      position={aktifPozisyon}
      args={[0.5, 0.5, 0.5]} // Kutunun boyutları
      material-color="orange" // Turuncu renkte ürün kutusu
    />
  );
}

// Büyük makine bileşeni - fabrika içindeki büyük üretim makineleri
function BuyukMakine({
  position,
  renk = "blue",
}: {
  position: [number, number, number];
  renk?: string;
}) {
  const meshRef = useRef<Mesh>(null);
  const [donmeHizi] = useState(Math.random() * 0.02 + 0.01); // Rastgele dönme hızı

  useEffect(() => {
    const interval = setInterval(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += donmeHizi;
      }
    }, 16);

    return () => clearInterval(interval);
  }, [donmeHizi]);

  return (
    <>
      {/* Ana makine gövdesi - büyük silindir */}
      <Cylinder
        ref={meshRef}
        args={[1.2, 1.2, 2.5]}
        position={[position[0], position[1] + 1.25, position[2]]}
        material-color={renk}
      />

      {/* Makine tabanı */}
      <Box args={[3, 0.3, 3]} position={position} material-color="darkgray" />

      {/* Makine üst kapağı */}
      <Cylinder
        args={[1.4, 1.4, 0.2]}
        position={[position[0], position[1] + 2.6, position[2]]}
        material-color="silver"
      />

      {/* Kontrol paneli */}
      <Box
        args={[0.8, 0.6, 0.1]}
        position={[position[0] + 1.8, position[1] + 1.5, position[2]]}
        material-color="black"
      />

      {/* Panel ışıkları - çalışma durumunu gösterir */}
      <Sphere
        args={[0.05]}
        position={[position[0] + 1.85, position[1] + 1.7, position[2] - 0.2]}
        material-color="green" // Yeşil = Çalışıyor
      />
      <Sphere
        args={[0.05]}
        position={[position[0] + 1.85, position[1] + 1.5, position[2] - 0.2]}
        material-color="red" // Kırmızı = Alarm
      />
      <Sphere
        args={[0.05]}
        position={[position[0] + 1.85, position[1] + 1.3, position[2] - 0.2]}
        material-color="yellow" // Sarı = Uyarı
      />
    </>
  );
}

// Raf sistemi bileşeni - fabrikada malzeme depolama
function RafSistemi({ position }: { position: [number, number, number] }) {
  return (
    <>
      {/* Raf direkleri - dört köşede direkler */}
      <Box
        args={[0.2, 4, 0.2]}
        position={[position[0] - 2, position[1] + 2, position[2] - 1]}
        material-color="brown"
      />
      <Box
        args={[0.2, 4, 0.2]}
        position={[position[0] + 2, position[1] + 2, position[2] - 1]}
        material-color="brown"
      />
      <Box
        args={[0.2, 4, 0.2]}
        position={[position[0] - 2, position[1] + 2, position[2] + 1]}
        material-color="brown"
      />
      <Box
        args={[0.2, 4, 0.2]}
        position={[position[0] + 2, position[1] + 2, position[2] + 1]}
        material-color="brown"
      />

      {/* Raf tabakaları - üç seviye raf */}
      <Box
        args={[4.5, 0.1, 2]}
        position={[position[0], position[1] + 1, position[2]]}
        material-color="brown"
      />
      <Box
        args={[4.5, 0.1, 2]}
        position={[position[0], position[1] + 2.5, position[2]]}
        material-color="brown"
      />
      <Box
        args={[4.5, 0.1, 2]}
        position={[position[0], position[1] + 4, position[2]]}
        material-color="brown"
      />

      {/* Raftaki malzeme kutuları - farklı renkler farklı malzemeleri temsil eder */}
      <Box
        args={[0.6, 0.6, 0.6]}
        position={[position[0] - 1.5, position[1] + 1.4, position[2] - 0.5]}
        material-color="orange"
      />
      <Box
        args={[0.6, 0.6, 0.6]}
        position={[position[0] - 0.5, position[1] + 1.4, position[2] - 0.5]}
        material-color="purple"
      />
      <Box
        args={[0.6, 0.6, 0.6]}
        position={[position[0] + 0.5, position[1] + 1.4, position[2] - 0.5]}
        material-color="cyan"
      />
      <Box
        args={[0.6, 0.6, 0.6]}
        position={[position[0] + 1.5, position[1] + 1.4, position[2] - 0.5]}
        material-color="orange"
      />

      {/* İkinci seviye kutuları */}
      <Box
        args={[0.6, 0.6, 0.6]}
        position={[position[0] - 1, position[1] + 2.9, position[2] + 0.3]}
        material-color="green"
      />
      <Box
        args={[0.6, 0.6, 0.6]}
        position={[position[0] + 1, position[1] + 2.9, position[2] + 0.3]}
        material-color="blue"
      />
    </>
  );
}

// Küçük dönen makine - eski makineler
function DonenMakine({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.02;
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Cylinder
        ref={meshRef}
        args={[0.8, 0.8, 1.5]}
        position={[position[0], position[1] + 0.75, position[2]]}
        material-color="darkblue"
      />
      <Box args={[2, 0.2, 2]} position={position} material-color="gray" />
    </>
  );
}

// Konveyör bant bileşeni - ürünlerin taşındığı yollar
function KonveyorBant({
  baslangic,
  bitis,
}: {
  baslangic: [number, number, number];
  bitis: [number, number, number];
}) {
  const uzunluk = Math.sqrt(
    Math.pow(bitis[0] - baslangic[0], 2) + Math.pow(bitis[2] - baslangic[2], 2)
  );

  const orta: [number, number, number] = [
    (baslangic[0] + bitis[0]) / 2,
    baslangic[1],
    (baslangic[2] + bitis[2]) / 2,
  ];

  return (
    <Box
      args={[uzunluk, 0.1, 0.8]}
      position={orta}
      material-color="darkgreen"
    />
  );
}

// Fabrika binası bileşeni - büyük ve detaylı fabrika yapısı
function FabrikaBinasi() {
  return (
    <>
      {/* Ana bina duvarları - çok daha büyük */}
      <Box args={[30, 8, 25]} position={[0, 4, 0]} material-color="lightgray" />

      {/* Çatı - ana bina */}
      <Box args={[31, 0.5, 26]} position={[0, 8.25, 0]} material-color="red" />

      {/* Yan binalar - depolar */}
      <Box args={[12, 6, 8]} position={[22, 3, 10]} material-color="gray" />
      <Box args={[12, 6, 8]} position={[-22, 3, -10]} material-color="gray" />
      <Box
        args={[8, 5, 12]}
        position={[15, 2.5, -15]}
        material-color="lightgray"
      />

      {/* Yan binaların çatıları */}
      <Box
        args={[13, 0.4, 9]}
        position={[22, 6.2, 10]}
        material-color="darkred"
      />
      <Box
        args={[13, 0.4, 9]}
        position={[-22, 6.2, -10]}
        material-color="darkred"
      />
      <Box
        args={[9, 0.4, 13]}
        position={[15, 5.2, -15]}
        material-color="darkred"
      />

      {/* Bacalar - farklı boyutlarda */}
      <Cylinder
        args={[0.5, 0.5, 4]}
        position={[10, 10.5, 8]}
        material-color="darkred"
      />
      <Cylinder
        args={[0.4, 0.4, 3.5]}
        position={[-8, 10, -6]}
        material-color="darkred"
      />
      <Cylinder
        args={[0.45, 0.45, 3.8]}
        position={[15, 10.4, -8]}
        material-color="darkred"
      />
      <Cylinder
        args={[0.3, 0.3, 2.5]}
        position={[-15, 9.5, 5]}
        material-color="darkred"
      />

      {/* Bacalardan çıkan duman efektleri - her bacadan farklı yoğunlukta */}
      {/* Baca 1 - en yoğun duman */}
      <Sphere
        args={[0.4]}
        position={[10, 12.8, 8]}
        material-color="white"
        material-transparent
        material-opacity={0.8}
      />
      <Sphere
        args={[0.35]}
        position={[10.4, 13.6, 8.3]}
        material-color="white"
        material-transparent
        material-opacity={0.6}
      />
      <Sphere
        args={[0.3]}
        position={[10.8, 14.4, 8.6]}
        material-color="white"
        material-transparent
        material-opacity={0.4}
      />
      <Sphere
        args={[0.25]}
        position={[11.2, 15.2, 8.9]}
        material-color="white"
        material-transparent
        material-opacity={0.2}
      />

      {/* Baca 2 dumanı */}
      <Sphere
        args={[0.3]}
        position={[-8, 13.8, -6]}
        material-color="white"
        material-transparent
        material-opacity={0.7}
      />
      <Sphere
        args={[0.25]}
        position={[-7.7, 14.5, -5.8]}
        material-color="white"
        material-transparent
        material-opacity={0.5}
      />
      <Sphere
        args={[0.2]}
        position={[-7.4, 15.2, -5.6]}
        material-color="white"
        material-transparent
        material-opacity={0.3}
      />

      {/* Baca 3 dumanı */}
      <Sphere
        args={[0.35]}
        position={[15, 14.5, -8]}
        material-color="white"
        material-transparent
        material-opacity={0.75}
      />
      <Sphere
        args={[0.28]}
        position={[15.3, 15.3, -7.7]}
        material-color="white"
        material-transparent
        material-opacity={0.5}
      />

      {/* Baca 4 dumanı */}
      <Sphere
        args={[0.2]}
        position={[-15, 12.2, 5]}
        material-color="white"
        material-transparent
        material-opacity={0.6}
      />
      <Sphere
        args={[0.15]}
        position={[-14.8, 12.8, 5.2]}
        material-color="white"
        material-transparent
        material-opacity={0.4}
      />

      {/* Fabrika kapıları - büyük yükleme kapıları */}
      <Box args={[5, 6, 0.3]} position={[0, 3, 12.65]} material-color="brown" />
      <Box
        args={[4, 5, 0.3]}
        position={[12, 2.5, 0.15]}
        material-color="brown"
      />
      <Box
        args={[3, 4, 0.3]}
        position={[-12, 2, -0.15]}
        material-color="brown"
      />

      {/* Pencereler - büyük endüstriyel pencereler */}
      <Box
        args={[2, 1.5, 0.1]}
        position={[-10, 5, 12.55]}
        material-color="lightblue"
      />
      <Box
        args={[2, 1.5, 0.1]}
        position={[10, 5, 12.55]}
        material-color="lightblue"
      />
      <Box
        args={[1.5, 2, 0.1]}
        position={[15.05, 4.5, 5]}
        material-color="lightblue"
      />
      <Box
        args={[1.5, 2, 0.1]}
        position={[15.05, 4.5, -5]}
        material-color="lightblue"
      />
      <Box
        args={[2, 1.5, 0.1]}
        position={[-5, 5, -12.55]}
        material-color="lightblue"
      />
      <Box
        args={[2, 1.5, 0.1]}
        position={[5, 5, -12.55]}
        material-color="lightblue"
      />

      {/* Ofis binası */}
      <Box args={[6, 10, 6]} position={[-25, 5, 8]} material-color="white" />
      <Box
        args={[6.2, 0.3, 6.2]}
        position={[-25, 10.15, 8]}
        material-color="gray"
      />

      {/* Ofis pencereleri */}
      <Box
        args={[1, 1, 0.1]}
        position={[-22.05, 6, 8]}
        material-color="lightblue"
      />
      <Box
        args={[1, 1, 0.1]}
        position={[-22.05, 8, 8]}
        material-color="lightblue"
      />
      <Box
        args={[1, 1, 0.1]}
        position={[-25, 6, 11.05]}
        material-color="lightblue"
      />
      <Box
        args={[1, 1, 0.1]}
        position={[-25, 8, 11.05]}
        material-color="lightblue"
      />
    </>
  );
}

// Ana fabrika simülasyon bileşeni
export default function FabrikaSimulasyonu() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* Başlık ve kontroller */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,
          color: "white",
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <h1 style={{ fontSize: "24px", margin: 0 }}>
          🏭 Büyük Fabrika Simülasyonu
        </h1>
        <p style={{ fontSize: "14px", margin: "5px 0" }}>
          Mouse ile döndürün, tekerlek ile zoom yapın
        </p>
        <p style={{ fontSize: "12px", margin: "5px 0", color: "#ccc" }}>
          ✅ 8 Büyük Makine | 🏗️ Raf Sistemleri | 🚚 Konveyör Bantlar
        </p>
      </div>

      {/* Three.js Canvas - 3D sahnenin ana konteyneri */}
      <Canvas
        camera={{
          position: [25, 15, 25], // Daha uzak kamera pozisyonu büyük fabrika için
          fov: 60,
        }}
        style={{ background: "linear-gradient(to bottom, #87CEEB, #90EE90)" }}
      >
        {/* Gelişmiş ışıklandırma */}
        <Lighting />

        {/* Büyük zemin */}
        <Box
          args={[60, 0.2, 60]}
          position={[0, -0.1, 0]}
          material-color="lightgreen"
        />

        {/* Yollar ve işaretlemeler */}
        <Box
          args={[50, 0.05, 2]}
          position={[0, 0.05, 18]}
          material-color="gray"
        />
        <Box
          args={[50, 0.05, 2]}
          position={[0, 0.05, -18]}
          material-color="gray"
        />
        <Box
          args={[2, 0.05, 36]}
          position={[20, 0.05, 0]}
          material-color="gray"
        />
        <Box
          args={[2, 0.05, 36]}
          position={[-20, 0.05, 0]}
          material-color="gray"
        />

        {/* Ana fabrika binası */}
        <FabrikaBinasi />

        {/* İçerdeki büyük makineler - ana üretim hattı */}
        <BuyukMakine position={[-8, 0.15, -5]} renk="blue" />
        <BuyukMakine position={[-8, 0.15, 0]} renk="green" />
        <BuyukMakine position={[-8, 0.15, 5]} renk="purple" />

        {/* İkinci üretim hattı */}
        <BuyukMakine position={[8, 0.15, -5]} renk="red" />
        <BuyukMakine position={[8, 0.15, 0]} renk="orange" />
        <BuyukMakine position={[8, 0.15, 5]} renk="cyan" />

        {/* Merkezi işlem makineleri */}
        <BuyukMakine position={[0, 0.15, -8]} renk="darkblue" />
        <BuyukMakine position={[0, 0.15, 8]} renk="darkgreen" />

        {/* Eski küçük makineler - hala çalışır durumda */}
        <DonenMakine position={[-12, 0.15, -10]} />
        <DonenMakine position={[12, 0.15, -10]} />
        <DonenMakine position={[-12, 0.15, 10]} />
        <DonenMakine position={[12, 0.15, 10]} />

        {/* Raf sistemleri - malzeme depolama */}
        <RafSistemi position={[-18, 0.15, -5]} />
        <RafSistemi position={[-18, 0.15, 5]} />
        <RafSistemi position={[18, 0.15, -5]} />
        <RafSistemi position={[18, 0.15, 5]} />

        {/* Ana konveyör sistemi - karmaşık ağ */}
        <KonveyorBant baslangic={[-8, 0.25, -5]} bitis={[-8, 0.25, 0]} />
        <KonveyorBant baslangic={[-8, 0.25, 0]} bitis={[-8, 0.25, 5]} />
        <KonveyorBant baslangic={[8, 0.25, -5]} bitis={[8, 0.25, 0]} />
        <KonveyorBant baslangic={[8, 0.25, 0]} bitis={[8, 0.25, 5]} />

        {/* Çapraz bağlantı bantları */}
        <KonveyorBant baslangic={[-8, 0.25, 0]} bitis={[0, 0.25, -8]} />
        <KonveyorBant baslangic={[8, 0.25, 0]} bitis={[0, 0.25, 8]} />
        <KonveyorBant baslangic={[0, 0.25, -8]} bitis={[0, 0.25, 8]} />

        {/* Depo bağlantı bantları */}
        <KonveyorBant baslangic={[-15, 0.25, -5]} bitis={[-8, 0.25, -5]} />
        <KonveyorBant baslangic={[-15, 0.25, 5]} bitis={[-8, 0.25, 5]} />
        <KonveyorBant baslangic={[15, 0.25, -5]} bitis={[8, 0.25, -5]} />
        <KonveyorBant baslangic={[15, 0.25, 5]} bitis={[8, 0.25, 5]} />

        {/* Hareket eden ürün kutuları - çok sayıda aktif ürün */}
        <HareketEdenKutu position={[-8, 1, -5]} hedef={[-8, 1, 0]} />
        <HareketEdenKutu position={[-8, 1, 0]} hedef={[-8, 1, 5]} />
        <HareketEdenKutu position={[8, 1, -5]} hedef={[8, 1, 0]} />
        <HareketEdenKutu position={[8, 1, 0]} hedef={[8, 1, 5]} />
        <HareketEdenKutu position={[-6, 1, 2]} hedef={[0, 1, -8]} />
        <HareketEdenKutu position={[6, 1, -2]} hedef={[0, 1, 8]} />
        <HareketEdenKutu position={[-15, 1, -3]} hedef={[-8, 1, -3]} />
        <HareketEdenKutu position={[15, 1, 3]} hedef={[8, 1, 3]} />
        <HareketEdenKutu position={[2, 1, -6]} hedef={[2, 1, 6]} />
        <HareketEdenKutu position={[-2, 1, 6]} hedef={[-2, 1, -6]} />

        {/* Fabrika ismi - büyük 3D metin */}
        <Text
          position={[0, 12, 0]}
          fontSize={2}
          color="darkblue"
          anchorX="center"
          anchorY="middle"
        >
          BÜYÜK ENDÜSTRİ FABRİKASI
        </Text>

        {/* Alt başlık */}
        <Text
          position={[0, 10, 0]}
          fontSize={0.8}
          color="darkgreen"
          anchorX="center"
          anchorY="middle"
        >
          Otomatik Üretim Sistemi
        </Text>

        {/* Gelişmiş kamera kontrolleri */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={80}
        />
      </Canvas>
    </div>
  );
}
