export default function mainHeader() {
    document.querySelector("body").insertAdjacentHTML("afterbegin",`
    <!-- Topbar -->
<div class="h-8 bg-[linear-gradient(90deg,#004d39,#07853e)] text-[10px] text-white md:h-[34px] md:text-[11px]">
  <div class="mx-auto flex h-full w-full max-w-[1120px] items-center justify-between px-[18px] md:px-8">
    <div class="flex items-center gap-3 md:gap-[22px]">
      <a class="inline-flex items-center gap-[7px]" href="tel:+2347033936505"><i class="bi bi-telephone-fill"></i> +234 7033936505</a>
      <a class="hidden items-center gap-[7px] md:inline-flex" href="mailto:support@vtu9ja.ng"><i class="bi bi-envelope"></i> support@vtu9ja.ng</a>
    </div>
    <div class="flex items-center gap-3.5 md:gap-[22px]">
      <a class="inline-flex items-center gap-[7px]" href="./login.html"><i class="bi bi-person-fill"></i> Login</a>
      <a class="inline-flex items-center gap-[7px]" href="./register.html"><i class="bi bi-person-plus-fill"></i> Register</a>
    </div>
  </div>
</div>

<!-- Header -->
<header class="sticky top-0 z-[5] h-16 bg-white md:h-[66px]">
  <div class="mx-auto flex h-full w-full max-w-[1120px] items-center justify-between gap-5 px-[18px] md:px-8">
    <a class="inline-flex shrink-0 items-center gap-[7px]" href="#home" aria-label="VTU9JA home">
      <span class="grid h-[39px] w-[37px] place-items-center bg-[#078b4d] text-[26px] text-white [clip-path:polygon(25%_0,100%_0,77%_100%,0_100%)] md:h-[43px] md:w-[41px] md:text-[29px]"><i class="bi bi-lightning-charge-fill"></i></span>
      <span class="flex flex-col leading-none">
        <span class="font-['Manrope',sans-serif] text-[26px] font-extrabold leading-none tracking-[-1.6px] text-[#0a2636] md:text-[29px]">VTU9<span class="text-[#078849]">JA</span></span>
        <span class="mt-[3px] text-[10px] tracking-[.35px] text-[#365768]">Fast · Secure · Reliable</span>
      </span>
    </a>
    <button class="ml-auto block border-0 bg-transparent text-[28px] text-[#007a45] md:hidden" type="button" aria-label="Open navigation" aria-expanded="false"><i class="bi bi-list"></i></button>
    <nav class="absolute inset-x-0 top-16 flex-col items-stretch whitespace-nowrap bg-white px-[22px] pb-[18px] pt-3 text-xs font-semibold shadow-[0_14px_20px_#0b332020] max-md:hidden max-md:[&.open]:flex md:static md:flex md:h-full md:flex-row md:items-center md:gap-[clamp(12px,2vw,25px)] md:p-0 md:shadow-none" aria-label="Main navigation">
      <a class="border-b border-[#edf2f2] px-1 py-2.5 text-[#007b43] transition-colors hover:text-[#007b43] md:border-b-2 md:border-[#00854a] md:px-0 md:py-2" href="#home">Home</a>
      <a class="border-b border-[#edf2f2] px-1 py-2.5 transition-colors hover:text-[#007b43] md:border-0 md:px-0 md:py-2" href="./buy-airtime.html">Airtime</a>
      <a class="border-b border-[#edf2f2] px-1 py-2.5 transition-colors hover:text-[#007b43] md:border-0 md:px-0 md:py-2" href="./buy-data.html">Data</a>
      <a class="border-b border-[#edf2f2] px-1 py-2.5 transition-colors hover:text-[#007b43] md:border-0 md:px-0 md:py-2" href="./pay-bills.html?type=tv">TV</a>
      <a class="border-b border-[#edf2f2] px-1 py-2.5 transition-colors hover:text-[#007b43] md:border-0 md:px-0 md:py-2" href="./pay-bills.html?type=electricity">Electricity</a>
      <a class="border-b border-[#edf2f2] px-1 py-2.5 transition-colors hover:text-[#007b43] md:border-0 md:px-0 md:py-2" href="./exam-pins.html">Exam Pins</a>
      <a class="border-b border-[#edf2f2] px-1 py-2.5 transition-colors hover:text-[#007b43] md:border-0 md:px-0 md:py-2" href="./more-services.html">More Services</a>
      <a class="border-b border-[#edf2f2] px-1 py-2.5 transition-colors hover:text-[#007b43] md:border-0 md:px-0 md:py-2" href="./about.html">About</a>
      <a class="border-b border-[#edf2f2] px-1 py-2.5 transition-colors hover:text-[#007b43] md:border-0 md:px-0 md:py-2" href="./contact.html">Contact</a>
    </nav>
    <a class="hidden min-h-[34px] min-w-[128px] items-center justify-center gap-[9px] rounded-[7px] bg-[linear-gradient(110deg,#00834b,#00703e)] px-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_#007a4533] md:inline-flex lg:min-w-[150px]" href="./login.html"><i class="bi bi-person-fill"></i> Login / Register</a>
  </div>
</header>`);
}