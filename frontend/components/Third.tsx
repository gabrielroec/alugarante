import Image from "next/image";
import React from "react";
import thirdImg from "../assets/Third.svg";

const Third = () => {
  return (
    <div className="pt-[100px]  bg-gradient-to-t from-[#F3F6ED] to-[#fff] rounded-[40px]">
      <div className="container flex items-center justify-between max-lg:flex-col">
        <div className="">
          <h1 className="text-4xl font-bold mb-3 max-lg:text-center">
            Como a <span className="text-[#003853">Alu</span>
            <span className="text-[#87A644]">garante</span> funciona?
          </h1>
          <p className="text-base mb-6 text-[#0D0D0D]  max-lg:mx-auto max-w-[600px] max-lg:text-center">
            Com a Alugarante, você contrata diretamente a fiança locatícia sem nenhum custo adicional para você. A contratação é simples e
            direta: você administra a locação do seu imóvel, enquanto a garantia é paga pelo inquilino.
          </p>

          <div className="flex w-full flex-wrap gap-4 max-lg:items-center max-lg:justify-center">
            <div className="flex items-center justify-center gap-10">
              <svg width="100" height="101" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="0.814331" width="100" height="100" rx="15" fill="white" />
                <path
                  d="M72.6191 48.4232V50.6375C72.6161 55.7718 70.9536 60.7677 67.8794 64.8799C64.8052 68.9922 60.484 72.0005 55.5604 73.4563C50.6367 74.912 45.3744 74.7372 40.5583 72.9579C35.7421 71.1786 31.6301 67.8901 28.8356 63.5829C26.0411 59.2757 24.7138 54.1805 25.0516 49.0573C25.3894 43.9341 27.3743 39.0573 30.7102 35.1543C34.0461 31.2513 38.5542 28.5312 43.5624 27.3997C48.5705 26.2682 53.8102 26.7859 58.5 28.8756"
                  stroke="#0F3554"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M75 29.2089L48.8095 55.3994L41.6667 48.2565"
                  stroke="#0F3554"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <div className="w-[250px]">
                <p>Garantia de Aluguel</p>
                <p>Em caso de inadimplência, seu aluguel está garantido.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-10">
              <svg width="100" height="101" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="0.814331" width="100" height="100" rx="15" fill="white" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M25 45.7902C25 44.6402 25.9323 43.7078 27.0824 43.7078H36.8004C37.9505 43.7078 38.8828 44.6402 38.8828 45.7902V70.7793C38.8828 71.9293 37.9505 72.8617 36.8004 72.8617H27.0824C25.9323 72.8617 25 71.9293 25 70.7793V45.7902ZM29.1648 47.8726V68.6968H34.718V47.8726H29.1648Z"
                  fill="#0F3554"
                  stroke="white"
                  stroke-width="2"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M55.3642 32.5918C54.2694 31.4972 52.4055 31.9372 51.916 33.4058L49.8821 39.5073C49.7916 39.779 49.6461 40.029 49.4545 40.2418L43.2072 47.1832C42.8123 47.6222 42.2497 47.8726 41.6594 47.8726H38.8828V68.6968H47.9066C49.0567 68.6968 49.989 69.6292 49.989 70.7792C49.989 71.9293 49.0567 72.8616 47.9066 72.8616H36.8004C35.6503 72.8616 34.718 71.9293 34.718 70.7792V45.7902C34.718 44.6401 35.6503 43.7078 36.8004 43.7078H40.7319L46.0683 37.7784L47.9649 32.0888C49.4334 27.683 55.0252 26.363 58.309 29.6468L58.8688 30.2065C60.3789 31.7169 61.0131 33.8941 60.5497 35.9792L58.8324 43.7078H67.3614C72.2462 43.7078 75.8746 48.2311 74.8151 52.9998L71.4885 67.9696C70.8532 70.8278 68.3179 72.8616 65.3898 72.8616H59.0129C57.8628 72.8616 56.9304 71.9293 56.9304 70.7792C56.9304 69.6292 57.8628 68.6968 59.0129 68.6968H65.3898C66.366 68.6968 67.2109 68.0188 67.4228 67.0661L70.7494 52.0963C71.2311 49.9286 69.5818 47.8726 67.3614 47.8726H56.2363C55.6046 47.8726 55.0071 47.5858 54.612 47.0932C54.2166 46.6004 54.0664 45.9551 54.2036 45.3384L56.484 35.0757C56.6386 34.3807 56.427 33.6549 55.9237 33.1515L55.3642 32.5918Z"
                  fill="#0F3554"
                  stroke="white"
                  stroke-width="2"
                />
              </svg>
              <div className="w-[250px]">
                <p>Processo Simples e Direto</p>
                <p>A contratação é simples e sem complicações.</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-10">
              <svg width="100" height="101" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="0.814331" width="100" height="100" rx="15" fill="white" />
                <path
                  d="M34.8051 66.8623C33.3513 66.8626 31.9156 66.5395 30.602 65.9165C29.2884 65.2934 28.1299 64.386 27.2103 63.26C26.2907 62.1339 25.6331 60.8174 25.285 59.4059C24.937 57.9943 24.9073 56.523 25.1981 55.0985C25.7029 52.8451 26.9692 50.8347 28.7835 49.4061C30.5978 47.9776 32.8491 47.2182 35.158 47.256H38.2362V66.8623H34.8051Z"
                  stroke="#0F3554"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M65.1948 66.8623C66.6487 66.8626 68.0844 66.5395 69.3979 65.9165C70.7115 65.2934 71.8701 64.386 72.7897 63.26C73.7093 62.1339 74.3669 60.8174 74.7149 59.4059C75.063 57.9943 75.0927 56.523 74.8019 55.0985C74.2971 52.8451 73.0308 50.8347 71.2165 49.4061C69.4022 47.9776 67.1508 47.2182 64.8419 47.256H61.7637V66.8623H65.1948Z"
                  stroke="#0F3554"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M32.3544 47.2559V44.9424C32.2838 40.9024 33.5851 36.9578 36.0458 33.7528C38.5064 30.5478 41.9811 28.2719 45.9024 27.2967C48.501 26.6763 51.2067 26.654 53.8152 27.2317C56.4238 27.8093 58.8671 28.9717 60.9609 30.6313C63.0547 32.2909 64.7443 34.4042 65.9023 36.812C67.0603 39.2197 67.6564 41.859 67.6457 44.5307V47.2559"
                  stroke="#0F3554"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M38.2363 66.8623C38.2363 68.4223 38.856 69.9183 39.959 71.0214C41.0621 72.1245 42.5582 72.7442 44.1181 72.7442"
                  stroke="#0F3554"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M51.4606 72.744C51.4606 73.5507 50.8067 74.2046 50 74.2046C49.1933 74.2046 48.5394 73.5507 48.5394 72.744C48.5394 71.9373 49.1933 71.2834 50 71.2834C50.8067 71.2834 51.4606 71.9373 51.4606 72.744Z"
                  fill="#0F3554"
                  stroke="#0F3554"
                />
                <path d="M33.3346 48.2361V65.8817" stroke="#0F3554" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M62.2637 66.3621V47.7559H65.185V66.3621H62.2637Z" fill="#0F3554" stroke="#0F3554" />
                <path d="M37.5 66.3143V47.3143H33.5V66.3143H37.5Z" fill="#0F3554" stroke="#0F3554" />
              </svg>

              <div className="w-[250px]">
                <p>Assessoria Técnica e Jurídica:</p>
                <p>Nossa equipe capacitada está à disposição para oferecer suporte completo.</p>
              </div>
            </div>
          </div>
        </div>
        <Image src={thirdImg} alt="alugarante" className="max-lg:w-full" />
      </div>
    </div>
  );
};

export default Third;
