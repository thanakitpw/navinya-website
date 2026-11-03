import Image from "next/image";

const clients = [
  { name: "AMATA", file: "amata", width: 480, height: 169 },
  { name: "การนิคมอุตสาหกรรมแห่งประเทศไทย (กนอ.)", file: "ieat", width: 315, height: 480 },
  { name: "การทางพิเศษแห่งประเทศไทย (EXAT)", file: "exat", width: 480, height: 480 },
  { name: "มหาวิทยาลัยหอการค้าไทย", file: "utcc", width: 480, height: 480 },
  { name: "ตลาดสี่มุมเมือง", file: "simummuang", width: 480, height: 478 },
  { name: "SCG", file: "scg", width: 480, height: 167 },
  { name: "ไทยยานยนตร์", file: "thaiyarnyon", width: 480, height: 287 },
  { name: "MBK Center", file: "mbk", width: 480, height: 93 },
  { name: "Komatsu", file: "komatsu", width: 480, height: 92 },
  { name: "สยามกลการ (Siam Motors Group)", file: "siammotors", width: 480, height: 479 },
  { name: "การบินไทย", file: "thaiairways", width: 480, height: 139 },
  { name: "ท่าอากาศยานไทย (AOT)", file: "aot", width: 480, height: 181 },
  { name: "ศรีไทยซุปเปอร์แวร์", file: "srithai", width: 480, height: 127 },
  { name: "TOA", file: "toa", width: 480, height: 398 },
  { name: "Shell", file: "shell", width: 438, height: 480 },
  { name: "บุญถาวร", file: "boonthavorn", width: 480, height: 90 },
  { name: "Seacon Square", file: "seacon", width: 480, height: 229 },
  { name: "ปตท. (PTT)", file: "ptt", width: 480, height: 214 },
  { name: "บิ๊กซี (Big C)", file: "bigc", width: 410, height: 480 },
  { name: "ทีโอที (TOT)", file: "tot", width: 480, height: 216 },
  { name: "BG", file: "bg", width: 480, height: 233 },
  { name: "Samsung", file: "samsung", width: 480, height: 86 },
  { name: "AGC", file: "agc", width: 480, height: 176 },
  { name: "กรมเจ้าท่า", file: "marinedept", width: 339, height: 480 },
  { name: "มิตรผล (Mitr Phol)", file: "mitrphol", width: 480, height: 322 },
  { name: "ปูนซีเมนต์เอเชีย (Asia Cement)", file: "asiacement", width: 478, height: 477 },
  { name: "พฤกษา (Pruksa)", file: "pruksa", width: 346, height: 480 },
  { name: "Thai Nakano", file: "thainakano", width: 480, height: 57 },
  { name: "Ajinomoto", file: "ajinomoto", width: 480, height: 346 },
  { name: "การรถไฟแห่งประเทศไทย (รฟท.)", file: "srt", width: 480, height: 283 },
  { name: "การยาสูบแห่งประเทศไทย", file: "tobacco", width: 400, height: 478 },
  { name: "Grand Unity", file: "grandunity", width: 480, height: 270 },
];

export function Clients() {
  return (
    <section className="clients" id="clients">
      <div className="container">
        <span className="uline" />
        <h3>ลูกค้าบางส่วนที่เราได้รับโอกาสให้บริการ</h3>
        <div className="logos">
          {clients.map((c) => (
            <div className="cl" key={c.file}>
              <Image src={`/clients/${c.file}.webp`} alt={c.name} title={c.name} width={c.width} height={c.height} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
