<div align="center">

# FoodSave

### *A plataforma de renovação de estoque que destrava capital de giro pro comércio local.*

Encontre promoções de queima de estoque em padarias, restaurantes, mercados e hortifrutis perto de você — economize até **70%** e ajude o pequeno comércio a manter o caixa em movimento.

<sub>Made in Sorocaba · 2026</sub>

</div>

---

<table>
<tr>
<td width="25%"><img src="./design/01-welcome-login.jpg" alt="Onboarding e login" /></td>
<td width="25%"><img src="./design/03-home-mapa.jpg" alt="Home e mapa" /></td>
<td width="25%"><img src="./design/05-detalhe-confirmacao.jpg" alt="Detalhe e confirmação" /></td>
<td width="25%"><img src="./design/07-reservas-perfil.jpg" alt="Reservas e perfil" /></td>
</tr>
<tr align="center">
<td><sub>Boas-vindas e login</sub></td>
<td><sub>Home e mapa de ofertas</sub></td>
<td><sub>Detalhe e confirmação</sub></td>
<td><sub>Reservas e impacto</sub></td>
</tr>
</table>

---

## Por que existimos

Estabelecimentos do setor alimentício operam com margem fina e estoque sensível. Quando um item para de girar — porque a procura caiu, porque o lote novo já está chegando, ou porque o pico do dia passou — o lojista precisa decidir entre **travar capital, perder produto, ou queimar preço sem ferramenta nenhuma**. Hoje isso é feito no chute, num quadro de aviso ou simplesmente não é feito.

O FoodSave transforma essa decisão em uma alavanca operacional. A cada produto com baixo giro, o estabelecimento publica uma promoção de queima de estoque, recupera capital, abre espaço pro próximo lote e fideliza um cliente do bairro pagando uma fração do preço cheio.

> **Margem, não discurso.**
> Não vendemos ESG. Vendemos giro de estoque.

## Como funciona

<table>
<tr>
<td width="50%" valign="top">

### Para quem compra

Abra o app, veja o que está em promoção perto de você, reserve em dois toques e retire na hora marcada com um QR Code.

- Ofertas com até 70% off em padarias, restaurantes, mercados e hortifrutis
- Mapa interativo com pinos de preço em tempo real
- Reserva instantânea, retirada em poucos minutos
- Acompanhamento de impacto: quanto você economizou, quanto ajudou a girar no comércio local e quanto de CO₂ deixou de ser emitido

</td>
<td width="50%" valign="top">

### Para quem vende

Cadastre seu produto sem giro, defina o desconto e deixe nosso motor preditivo sugerir o resto. Recupere capital travado em segundos.

- Painel com capital recuperado no mês e gráfico de vendas dos últimos 7 dias
- Cadastro individual ou em lote
- Alertas preditivos com sugestão de desconto pra acelerar o giro
- Confirmação de retirada via QR Code, com baixa automática de estoque

</td>
</tr>
</table>

---

## A experiência

<table>
<tr>
<td width="50%">

**Onboarding e login**

Carrossel com gradiente verde-floresta, ilustrações vetoriais artesanais e tipografia serif com palavras-chave em itálico. Um único login serve para os dois perfis (consumidor e estabelecimento).

</td>
<td width="50%">
<img src="./design/01-welcome-login.jpg" alt="Welcome e login" />
</td>
</tr>
<tr>
<td width="50%">
<img src="./design/03-home-mapa.jpg" alt="Home e mapa" />
</td>
<td width="50%">

**Descoberta**

A home apresenta uma saudação dinâmica, um banner verde mostrando quanto cada cliente ajudou a girar no mês, chips horizontais por categoria e a lista de ofertas do dia. O mapa traz pinos de preço sobrepostos a uma planta estilizada e um card flutuante para o item selecionado.

</td>
</tr>
<tr>
<td width="50%">

**Da reserva ao QR Code**

A tela de detalhe abre em um hero ilustrado de cor única, com badges de status e um bloco de preço destacando o desconto em itálico âmbar. A reserva gera um código `FS · XXXX` único e um QR Code real apresentado no estabelecimento.

</td>
<td width="50%">
<img src="./design/05-detalhe-confirmacao.jpg" alt="Detalhe e confirmação" />
</td>
</tr>
<tr>
<td width="50%">
<img src="./design/07-reservas-perfil.jpg" alt="Reservas e perfil" />
</td>
<td width="50%">

**Acompanhamento e impacto**

A aba de reservas separa pendentes e histórico, com uma barra colorida no topo de cada cartão indicando urgência. O perfil reúne o card âmbar de impacto (kg em circulação · refeições mantidas em movimento) e dois cartões compactos com R$ economizados e CO₂ evitado.

</td>
</tr>
</table>

---

## Identidade visual

<table>
<tr>
<th align="left" width="25%">Token</th>
<th align="left" width="50%">Aplicação</th>
<th align="left" width="25%">Hex</th>
</tr>
<tr>
<td><b>Verde floresta</b></td>
<td>Cor primária, CTAs, cabeçalhos</td>
<td><code>#2d4a2b</code></td>
</tr>
<tr>
<td><b>Creme</b></td>
<td>Fundo padrão de todas as telas</td>
<td><code>#f5efe6</code></td>
</tr>
<tr>
<td><b>Âmbar</b></td>
<td>Acento quente, badges de desconto</td>
<td><code>#d97540</code></td>
</tr>
<tr>
<td><b>Sage</b></td>
<td>Superfícies secundárias e cards leves</td>
<td><code>#c8d5c0</code></td>
</tr>
<tr>
<td><b>Tinta</b></td>
<td>CTAs alternativos e tipografia primária</td>
<td><code>#1a1a1a</code></td>
</tr>
</table>

**Fraunces** carrega os títulos com itálicos expressivos em palavras-chave. **Inter** sustenta o corpo de texto. Cards com cantos generosos (16–24px), sombras sutis e *pill buttons* totalmente arredondados completam o tom de revista editorial.

---

## Stack

<table>
<tr><td><b>Mobile runtime</b></td><td>React Native 0.81 · Expo SDK 54 · TypeScript</td></tr>
<tr><td><b>Navegação</b></td><td>React Navigation (native-stack + bottom-tabs)</td></tr>
<tr><td><b>Estado</b></td><td>Zustand</td></tr>
<tr><td><b>Tipografia</b></td><td>Fraunces e Inter via expo-google-fonts</td></tr>
<tr><td><b>UI / motion</b></td><td>expo-linear-gradient · react-native-svg · react-native-qrcode-svg · react-native-chart-kit · lucide-react-native</td></tr>
<tr><td><b>Plataformas</b></td><td>iOS 16+ · Android 13+ (managed workflow)</td></tr>
</table>

---

## Rodando localmente

Pré-requisitos: **Node 18+**, **Xcode** (iOS) e/ou **Android Studio**.

```bash
git clone git@github.com:fehhffl/FoodSave.git
cd FoodSave
npm install
npx expo start
```

No prompt do Expo: pressione `i` para abrir no simulador iOS, `a` para Android ou escaneie o QR Code com o **Expo Go** em um dispositivo físico.

### Credenciais de demonstração

| Perfil          | E-mail                        | Senha    |
| --------------- | ----------------------------- | -------- |
| Consumidor      | `lucas.andrade@email.com`     | `123456` |
| Estabelecimento | `padaria@foodsave.com`        | `123456` |

Outros estabelecimentos disponíveis: `napoli@foodsave.com`, `bistro@foodsave.com`, `hortifruti@foodsave.com` (mesma senha).

---

## Estrutura

```
FoodSave/
├─ App.tsx                    # Bootstrap de fontes, providers e navegação
├─ app.json                   # Configuração Expo
├─ design/                    # Mockups oficiais da marca
└─ src/
   ├─ components/             # Primitivos (Text, Button, Card, Chip, Badge, Thumbnail, ToastHost…)
   ├─ data/                   # Catálogos de estabelecimentos, produtos, reservas
   ├─ navigation/             # RootNavigator + ConsumerTabs + EstablishmentTabs
   ├─ screens/
   │  ├─ auth/                # Welcome, Login
   │  ├─ consumer/            # Home, Map, ProductDetail, ReservationConfirmed, Reservations, ReservationQR, Profile
   │  └─ establishment/       # Dashboard, MyProducts, ReservationsReceived, Alerts, AddProduct, BatchProducts
   ├─ store/                  # Estado global compartilhado entre os dois perfis
   ├─ theme/                  # Cores, tipografia, espaçamento, sombras, raio
   ├─ types/                  # Tipos compartilhados
   └─ utils/                  # Formatadores (BRL, %, datas)
```

---

## Roadmap

| Próxima onda                                | Status        |
| ------------------------------------------- | ------------- |
| Pagamento integrado (Pix + cartão)          | em projeto    |
| Notificações push de ofertas em raio        | em projeto    |
| Programa de fidelidade com selo verde       | discovery     |
| Painel ESG agregado para redes              | discovery     |
| API pública para integração com PDV         | em pesquisa   |

---

## Licença

Proprietária. Todos os direitos reservados © 2026 FoodSave.

<div align="center">
<sub>Made with care in Sorocaba/SP · Movendo estoque, gerando giro, deixando comida no prato.</sub>
</div>
