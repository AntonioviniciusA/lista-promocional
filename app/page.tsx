'use client'

import { ChangeEvent, useMemo, useRef, useState } from 'react'
import {
  Check,
  ImagePlus,
  PackagePlus,
  Plus,
  Share2,
  ShoppingBag,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type Product = {
  id: number
  name: string
  description: string
  price: string
  unit: string
  image: string
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Manga palmer',
    description: 'Manga selecionada, doce e suculenta.',
    price: '7,99',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 2,
    name: 'Café torrado',
    description: 'Café especial, torra média, 500 g.',
    price: '18,90',
    unit: 'un',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 3,
    name: 'Azeite extravirgem',
    description: 'Azeite português, acidez máxima 0,5%.',
    price: '29,90',
    unit: 'un',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=85',
  },
]

const units = ['un', 'kg', 'g', 'L', 'ml', 'cx', 'pct']

export default function Page() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('un')
  const [image, setImage] = useState('')
  const [notice, setNotice] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const total = useMemo(() => products.length, [products])

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
  }

  function addProduct() {
    if (!name.trim() || !price.trim()) {
      setNotice('Preencha o nome e o valor do produto.')
      return
    }

    setProducts((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        description: description.trim() || 'Produto em promoção.',
        price: price.trim(),
        unit,
        image:
          image ||
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85',
      },
    ])
    setName('')
    setDescription('')
    setPrice('')
    setUnit('un')
    setImage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setNotice('Produto adicionado à lista.')
  }

  function removeProduct(id: number) {
    setProducts((current) => current.filter((product) => product.id !== id))
    setNotice('Produto removido.')
  }

  async function exportToWhatsApp() {
    if (!products.length) {
      setNotice('Adicione pelo menos um produto antes de exportar.')
      return
    }

    const message = `*OFERTAS DA SEMANA*\n\n${products
      .map(
        (product, index) =>
          `${index + 1}. *${product.name}*\n${product.description}\n*R$ ${product.price} / ${product.unit}*`,
      )
      .join('\n\n')}\n\nAproveite as ofertas!`

    const files: File[] = []
    for (const product of products) {
      try {
        const response = await fetch(product.image)
        const blob = await response.blob()
        files.push(new File([blob], `${product.name.replaceAll(' ', '-').toLowerCase()}.jpg`, { type: blob.type }))
      } catch {
        // Mantém a exportação do texto mesmo quando uma imagem externa não puder ser baixada.
      }
    }

    if (navigator.share && files.length && navigator.canShare?.({ files })) {
      await navigator.share({ title: 'Ofertas da semana', text: message, files })
      setNotice('Lista compartilhada com as imagens.')
      return
    }

    await navigator.clipboard?.writeText(message)
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setNotice('Texto copiado e WhatsApp aberto. Anexe as fotos da lista para enviar.')
  }

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#19352b]">
      <header className="border-b border-[#dce7df] bg-[#f7f7f2]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#1d5c47] text-white shadow-sm">
              <ShoppingBag aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">Lista de Ofertas</p>
              <p className="text-xs text-[#6c8177]">Monte. Compartilhe. Venda mais.</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-[#e7f1ea] px-3 py-2 text-xs font-semibold text-[#287052] sm:flex">
            <Check aria-hidden="true" /> Tudo pronto para compartilhar
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-12">
        <section className="mb-6 max-w-2xl sm:mb-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#d56a3b]">Catálogo rápido</p>
          <h1 className="text-3xl font-black leading-[1.05] tracking-tight text-[#19352b] sm:text-5xl">Suas ofertas, prontas para o WhatsApp.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#668078]">Adicione os produtos da semana e transforme sua seleção em uma lista bonita para enviar aos seus clientes.</p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
          <section className="rounded-3xl border border-[#dce7df] bg-white p-5 shadow-[0_18px_50px_rgba(24,70,50,0.07)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#e8f3eb] text-[#1d5c47]"><PackagePlus aria-hidden="true" /></div>
              <div><h2 className="font-bold">Adicionar produto</h2><p className="text-xs text-[#789087]">Preencha os dados da oferta</p></div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex cursor-pointer flex-col gap-2">
                <span className="text-sm font-semibold">Foto do produto <span className="font-normal text-[#9aaba3]">(opcional)</span></span>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="group relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#cbded2] bg-[#f7fbf8] transition hover:border-[#6eaa87]">
                  {image ? <img src={image} alt="Pré-visualização do produto" className="size-full object-cover" /> : <span className="flex flex-col items-center gap-2 text-[#6b887b]"><ImagePlus aria-hidden="true" /><span className="text-xs font-medium">Clique para adicionar uma foto</span></span>}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="sr-only" />
              </label>

              <label className="flex flex-col gap-2"><span className="text-sm font-semibold">Nome do produto</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Tomate italiano" lang="pt-BR" spellCheck autoCorrect="on" autoCapitalize="sentences" className="h-11 rounded-xl border border-[#d6e3da] bg-[#fbfdfb] px-3 text-sm outline-none transition placeholder:text-[#a1b1aa] focus:border-[#4d936e] focus:ring-2 focus:ring-[#d9eee0]" /></label>
              <label className="flex flex-col gap-2"><span className="text-sm font-semibold">Descrição</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ex.: Fresco e selecionado" rows={2} lang="pt-BR" spellCheck autoCorrect="on" autoCapitalize="sentences" className="resize-none rounded-xl border border-[#d6e3da] bg-[#fbfdfb] px-3 py-3 text-sm outline-none transition placeholder:text-[#a1b1aa] focus:border-[#4d936e] focus:ring-2 focus:ring-[#d9eee0]" /></label>
              <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-2 sm:grid-cols-[1fr_100px] sm:gap-3"><label className="flex flex-col gap-2"><span className="text-sm font-semibold">Valor (R$)</span><input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" placeholder="0,00" className="h-11 rounded-xl border border-[#d6e3da] bg-[#fbfdfb] px-3 text-sm outline-none transition placeholder:text-[#a1b1aa] focus:border-[#4d936e] focus:ring-2 focus:ring-[#d9eee0]" /></label><label className="flex flex-col gap-2"><span className="text-sm font-semibold">Unidade</span><select value={unit} onChange={(event) => setUnit(event.target.value)} className="h-11 rounded-xl border border-[#d6e3da] bg-[#fbfdfb] px-3 text-sm outline-none focus:border-[#4d936e] focus:ring-2 focus:ring-[#d9eee0]">{units.map((option) => <option key={option}>{option}</option>)}</select></label></div>
              <Button type="button" onClick={addProduct} className="mt-1 h-11 rounded-xl bg-[#1d5c47] font-bold text-white shadow-sm hover:bg-[#174b39]"> <Plus data-icon="inline-start" /> Adicionar à lista</Button>
              {notice && <p role="status" className="text-center text-xs font-medium text-[#4d8065]">{notice}</p>}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between gap-4"><div><div className="flex items-center gap-2"><h2 className="text-2xl font-black tracking-tight">Ofertas da semana</h2><span className="rounded-full bg-[#e6f0e8] px-2.5 py-1 text-xs font-bold text-[#357457]">{total} {total === 1 ? 'item' : 'itens'}</span></div><p className="mt-1 text-sm text-[#789087]">Confira e edite sua lista antes de compartilhar.</p></div><button type="button" className="hidden text-sm font-semibold text-[#799086] transition hover:text-[#1d5c47] sm:block" onClick={() => { setProducts([]); setNotice('Lista limpa.') }}>Limpar lista</button></div>
            {products.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <article key={product.id} className="group overflow-hidden rounded-2xl border border-[#dce7df] bg-white shadow-[0_12px_35px_rgba(24,70,50,0.05)]"><div className="relative aspect-[1.25] overflow-hidden bg-[#edf3ed]"><img src={product.image} alt={product.name} className="size-full object-cover transition duration-500 group-hover:scale-105" /><button type="button" onClick={() => removeProduct(product.id)} aria-label={`Remover ${product.name}`} className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-[#af5b4a] shadow-sm backdrop-blur transition hover:bg-white"><Trash2 aria-hidden="true" /></button><span className="absolute bottom-3 left-3 rounded-full bg-[#d56a3b] px-2.5 py-1 text-[11px] font-bold text-white">PROMOÇÃO</span></div><div className="p-4"><h3 className="font-bold text-[#19352b]">{product.name}</h3><p className="mt-1 min-h-10 text-sm leading-5 text-[#789087]">{product.description}</p><div className="mt-3 flex items-end justify-between border-t border-[#edf2ee] pt-3"><p className="text-xl font-black text-[#1d5c47]">R$ {product.price}<span className="ml-1 text-xs font-semibold text-[#789087]">/ {product.unit}</span></p><span className="text-xs text-[#9aaba3]">Oferta especial</span></div></div></article>)}</div> : <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#cbded2] bg-white/60 p-8 text-center"><div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#e8f3eb] text-[#4d936e]"><PackagePlus aria-hidden="true" /></div><h3 className="font-bold">Sua lista está vazia</h3><p className="mt-1 text-sm text-[#789087]">Adicione seu primeiro produto usando o formulário.</p></div>}

            <div className="mt-6 flex flex-col items-stretch justify-between gap-4 rounded-2xl bg-[#1d5c47] p-4 text-white shadow-[0_16px_35px_rgba(29,92,71,0.2)] sm:flex-row sm:items-center sm:px-6 sm:py-5"><div><p className="font-bold">Lista pronta para enviar?</p><p className="mt-1 text-sm text-[#c8e3d1]">Compartilhe ofertas e fotos direto pelo WhatsApp.</p></div><Button type="button" onClick={exportToWhatsApp} className="h-11 w-full rounded-xl bg-[#d8f06a] font-bold text-[#19352b] hover:bg-[#c9e45a] sm:w-auto"><Share2 data-icon="inline-start" /> Exportar para WhatsApp</Button></div>
          </section>
        </div>
      </div>
    </main>
  )
}
