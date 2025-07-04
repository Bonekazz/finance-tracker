export default function Page() {
  return (
    <div className="w-full h-full flex flex-col gap-[28px]">
        
      <header className="w-full flex justify-between">
        <h1 className="text-[32px] font-semibold max-w-[207px] leading-[35px]">Resumo Deste Mês</h1>
      </header>

      { /** SALDO **/ }
      <div className="flex flex-col gap-[22px] px-[17px] py-[28px] rounded-2xl border border-[#CACACA]">
        <div className="flex flex-col">
          <p className="text-[20px] font-medium">Saldo</p>
          <p className="text-[36px] font-bold mt-[-10px]">R$ 2.380,00</p>
        </div>
        
        <div className="w-full flex gap-[38px]">
          <div className="flex flex-col gap-[-5px]">
            <p className="text-[15px] font-medium">Ganhos</p>
            <p className="text-[16px] font-bold">R$ 2.380,00</p>
          </div>
          <div className="flex flex-col gap-[-5px]">
            <p className="text-[15px] font-medium">Despesas</p>
            <p className="text-[16px] font-bold">R$ 2.380,00</p>
          </div>
        </div>

      </div>

    </div>
  )
}
