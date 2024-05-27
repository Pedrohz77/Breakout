import { Actor, CollisionType, Color,  Engine, Font, Text, vec } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo
const game = new Engine({
  width: 800,
  height: 600
})

// 2 - Criar barra do player
const barra = new Actor({
   x: 150,
   y: game.drawHeight - 40,
   width: 200,
   height: 20,
   color: Color.Chartreuse   
})

// Define o tipo de colisão da barra
// CollisionType.fixed = significa que ele não irá se "mexer" quando colidir
barra.body.collisionType = CollisionType.Fixed

// Insere o Actor barra - player, no game
game.add(barra)

// 3 - Movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	// Faz a posição x da barra, ser igual a posicão x do mouse
	barra.pos.x = event.worldPos.x
})

// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

// 5 - Criar movimentação da bolinha
const velocidadeBolinha = vec(100, 100)

// Após 1 segundo(1000 ms), define a velocidade da bolinha em x = 100 e y = 100
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000) 

// 6 - fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
    if (bolinha.pos.x < bolinha.width / 2) {
        bolinha.vel.x = velocidadeBolinha.x
	}
	// Se a bolinha colidir com o lado direito
    if (bolinha.pos.x + bolinha.width /2 > game.drawWidth) {
        bolinha.vel.x = -velocidadeBolinha.x 
	}

    // Se a bolinha colidir com a parte superior
    if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}

	// Se a bolinha colidir com a parte inferior
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	bolinha.vel.y = -velocidadeBolinha.y
	// }
})

// Insere bolinha no game
game.add(bolinha)

// 7 - Criar os blocos
// Configurações de tamanho e espaçamento dos blocos
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Renderização dos bloquinho

// Renderiza 3 linhas
for(let j = 0; j < linhas; j++) {

// Renderizar 5 bloquinhos
for(let i = 0; i < colunas; i++) {
	listaBlocos.push(
        new Actor({
			x: xoffset + i * (larguraBloco + padding) + padding,
		    y: yoffset + j * (alturaBloco + padding) + padding,
			width: larguraBloco,
			height: alturaBloco,
			color: corBloco[j]
		})
	)
    }
}

listaBlocos.forEach( bloco => {
	// Define o tipo de colisor de cada bloco
	bloco.body.collisionType = CollisionType.Active
	
	// Adiciona cada bloco no game
	game.add(bloco)
})

let pontos = 0

const textPontos = new Text({
	text: "Hello World" ,
	font: new Font({size: 20 })
})

const objetoTexto = new Actor({
	x: game.drawWidth - 80,
	y: game.drawHeight - 15

})

objetoTexto.graphics.use(textPontos)

game.add(objetoTexto)

let colidindo: boolean = false 

bolinha.on("collisionstart", (event) => {
	// Verificar se a bolinha colidiu com algum bloco destrutivel
	console.log(event.other);

	// Se o elemento colidido for um bloco da lista de blocos (destrutivel)
	if (listaBlocos.includes(event.other)) {
       // Destruir o bloco colidido
	   event.other.kill()
	}

	// Rebater a bolinha - inverter as direcoes
	// "minimum translation vector" is a vector `normalize()`
	let interseccao = event.contact.mtv.normalize()

	// Se não está colidindo
	// colidindo -> colidindo == false
    if (!colidindo) {
		colidindo = true 

	// interseccao.x e interseccao.y
	// O maior representa o eixo onde houve o contato
	   if ( Math.abs(interseccao.x) > Math.abs(interseccao.y) ) {
        // bolinha.vel.x = -bolinha.vel.x
		// bolinha.vel.x *= -1
        bolinha.vel.x = bolinha.vel.x * -1
	   } else {
		// bolinha.vel.y = -bolinha.vel.y
		// bolinha.vel.x *= -1
		bolinha.vel.y = bolinha.vel.y * -1
	   }
	}
})

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	alert("E morreu")
	window.location.reload()
})

// Inicia o game
game.start()