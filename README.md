# Sua Confeitaria — site institucional + pedidos online

Projeto estático e responsivo em HTML, CSS e JavaScript. A página inicial funciona como vitrine institucional, enquanto `loja.html` apresenta os produtos, quantidades, carrinho e finalização pelo WhatsApp.

## Estrutura

```text
confeitaria-integrada/
├── index.html           # página institucional
├── loja.html            # cardápio e pedidos online
├── produtos.js          # produtos, categorias, preços e descrições
├── script.js            # carrossel, filtros, carrinho e WhatsApp
├── styles.css           # visual completo e responsividade
├── assets/
│   ├── logo-mark.svg
│   └── images/
├── vercel.json
└── README.md
```

## O que está pronto

- cabeçalho fixo durante a rolagem;
- carrossel automático com quatro imagens;
- vitrine de categorias semelhante à organização da referência;
- botão **Peça online** no cabeçalho;
- página separada de produtos;
- filtros por categoria e pesquisa;
- seletor de quantidade em cada produto;
- carrinho compartilhado entre as duas páginas;
- alteração e remoção de quantidades no carrinho;
- total automático em reais;
- dados de retirada/entrega, data e observações;
- pedido formatado e enviado pelo WhatsApp;
- produtos personalizados direcionados diretamente ao WhatsApp;
- armazenamento do carrinho no navegador;
- layout responsivo para computador, tablet e celular;
- endereço demonstrativo e rodapé personalizado.

## Alterar nome e WhatsApp

Abra `script.js` e altere este bloco:

```js
const SITE_CONFIG = {
  businessName: "Sua Confeitaria",
  whatsappNumber: "",
  currency: "BRL",
  locale: "pt-BR",
  carouselInterval: 5500,
  cartStorageKey: "sua-confeitaria-cart",
};
```

No WhatsApp, use apenas números com DDI e DDD. Exemplo fictício:

```js
whatsappNumber: "5547999999999"
```

Enquanto o número estiver vazio, a mensagem será montada normalmente e o WhatsApp permitirá selecionar um contato.

## Alterar produtos e preços

Edite `produtos.js`. Cada produto segue este formato:

```js
{
  id: "bolo-chocolate",
  name: "Bolo de chocolate",
  category: "bolos",
  categoryLabel: "Bolos e tortas",
  description: "Descrição do produto.",
  price: 89.90,
  unit: "unidade",
  badge: "Mais pedido",
  image: "assets/images/hero-2.svg"
}
```

Use ponto para os centavos no código. O site converte automaticamente para o formato brasileiro, como `R$ 89,90`.

## Categorias disponíveis

- `bolos`
- `doces`
- `paes`
- `salgados`
- `kits`

Os cards da página inicial abrem `loja.html` já com a categoria correspondente selecionada.

## Executar localmente

Na pasta do projeto, execute:

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```

## Publicar na Vercel

1. Envie a pasta para um repositório no GitHub.
2. Importe o repositório na Vercel.
3. Em **Framework Preset**, escolha **Other**.
4. Não configure comando de build.
5. Publique.
