# Doce Café confeitaria — site + pedidos online

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

## O que foi feito

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


## Executar localmente

Na pasta do projeto, execute:

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```
