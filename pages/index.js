import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import HomeCss from '../styles/Home.module.css'
import Link from 'next/link'



export default function Home({ pokemons, minData, tipos, notFound }) {


  const [filtro, setFiltrar] = useState(minData)

  const filtrar = (Tipo) => {

    setFiltrar(minData)

    if (Tipo === "borrar") {
      setFiltrar(minData)
    }
    else {

      let filtradoPorTypo = minData
        .filter((pokemon) => pokemon.types.some((tipo) => tipo.type.name === Tipo))
        .map((tem2) => {

          let nuevosTem = { ...tem2 }

          return nuevosTem
        })
      setFiltrar(filtradoPorTypo)

    }

  }





  return (
    <>
      <div className={HomeCss.container}>
        <div className={HomeCss.filtros}>
          <button className={`${HomeCss.botaoFiltro} ${HomeCss.botaoTodos}`} onClick={() => filtrar("borrar")}>
            Mostrar todos
          </button>
          <div className={HomeCss.botones}>
            {
              tipos.map((tipo, index) => {

                return (
                  <button key={tipo.name} className={`${HomeCss.botaoFiltro} ${tipo.name}`} aria-label={tipo.name} onClick={() => filtrar(tipo.name)}>

                    {tipo.name}

                  </button>
                )
              })
            }


          </div>
        </div>


        <div className={HomeCss.titulo}>
          <h1>Pokemons</h1>
        </div>
        <div className={HomeCss.colunas}>

          <ul>
            {filtro ? filtro.map(pokemon => (
              <li key={pokemon.id}>
                <Link scroll={false} href={{
                  pathname: '/pokemon/[name]',
                  query: { name: pokemon.name }
                }}>
                  <a>
                    <div className={`${HomeCss.card} ${pokemon.types[0].type.name}`}>
                      <div className={HomeCss.nomeTipos}>

                        <h3 exit={{ opacity: 0 }}>{pokemon.name}</h3>


                        <div className={HomeCss.tipos}>
                          {pokemon.types.map((tipos, index) => {
                            return (
                              <div key={index} className={HomeCss.tipo}>
                                {tipos.type.name}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <img
                        src={pokemon.sprites}
                        alt={pokemon.name}
                        width={100}
                        height={100}
                        className={HomeCss.imagem}
                      />
                    </div>
                  </a>


                </Link>
              </li>
            )) : 'Carregando...'}
          </ul>
        </div>


      </div>
    </>
  )
}

export async function getStaticProps(context) {

  const resTipos = await fetch('https://pokeapi.co/api/v2/type')
  const tipos = await resTipos.json()

  const trazerPokemon = async (porPokemon) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${porPokemon}?limit=101&offset=0/`)
    const data = await response.json()

    return data
  }
  let pokemons = []
  for (let i = 1; i <= 101; i++) {
    let data = await trazerPokemon(i)
    pokemons.push(data)
  }



  let minData = pokemons.map(pokemon => {
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprites: pokemon.sprites.other.dream_world.front_default,
      types: pokemon.types
    }
  })



  return {
    props: {
      tipos: tipos.results,
      minData,

    },
  }
}
