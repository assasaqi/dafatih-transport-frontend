// src/utils/whatsapp.js

const DEFAULT_ADMIN_PHONE = '6287757004214';

export const sendBookingToWhatsApp = (formData = {}, phone = DEFAULT_ADMIN_PHONE) => {
  const {
    custName = '-',
    custWa = '-',
    pickupDate = '-',
    pickupTime = '-',
    pickupLoc = '-',
    dropLoc = '-',
    passengers = '',
    notes = '',
    price = 0,
    discountAmount = 0,
    finalPrice,
  } = formData;

  const rawWaDigits = String(custWa).replace(/\D/g, '');
  const normalPriceNum = Number(price) || 0;
  const discountNum = Number(discountAmount) || 0;

  const totalPriceNum =
    finalPrice !== undefined && finalPrice !== null
      ? Number(finalPrice)
      : Math.max(0, normalPriceNum - discountNum);

  const formatRupiah = (val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return 'Rp 0';
    return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
  };

  const discountText = discountNum > 0
    ? `\n- Diskon Tarif: -${formatRupiah(discountNum)}`
    : '';

  const passengersText = passengers
    ? `\n- Penumpang: *${passengers} Orang*`
    : '';

  const notesText = notes
    ? `\n- Catatan: *${notes}*`
    : '';

  const message = `*PEMESANAN RUTE - DAFATIH TRANSPORT*
-------------------------------------------

*INFORMASI PEMESAN*
- Nama: *${custName}*
- WhatsApp: *+${rawWaDigits}*

*DETAIL PERJALANAN*
- Tanggal Jemput: *${pickupDate}*
- Jam Jemput: *${pickupTime} WITA*
- Lokasi Jemput: *${pickupLoc}*
- Tujuan: *${dropLoc}*${passengersText}${notesText}

*RINCIAN ESTIMASI BIAYA*
- Tarif Normal: ${formatRupiah(normalPriceNum)}${discountText}
-------------------------------------------
*TOTAL BAYAR: ${formatRupiah(totalPriceNum)}*
-------------------------------------------

Halo Admin, mohon konfirmasi ketersediaan armada untuk jadwal di atas. Terima kasih!`;

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  window.open(waUrl, '_blank', 'noopener,noreferrer');
};
