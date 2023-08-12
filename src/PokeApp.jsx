import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap"; // Importa el componente Modal de React-bootstrap

function PokeApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=200")
      .then((response) => response.json())
      .then((data) => {
        setPokemonList(data.results);
        setFilteredPokemonList(data.results);
      });
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );

    setFilteredPokemonList(filteredList);
  };

  const handleCardClick = async (name) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Pokedex</h1>
      <div className="form-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar Pokémon"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="row">
        {filteredPokemonList.map((pokemon) => (
          <div key={pokemon.name} className="col-md-4 mb-4">
            <div
              className="card"
              onClick={() => handleCardClick(pokemon.name)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                  pokemon.url.split("/")[6]
                }.png`}
                alt={pokemon.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{pokemon.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal
        show={selectedPokemon !== null}
        onHide={handleCloseModal}
        centered // Agrega el prop centered para centrar el modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }} // Estilos para centrar vertical y horizontalmente
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedPokemon?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center justify-content-center mb-3">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon?.id}.png`}
              alt={selectedPokemon?.name}
              className="modal-pokemon-image"
            />
          </div>
          <p>Height: {selectedPokemon?.height}</p>
          <p>Weight: {selectedPokemon?.weight}</p>
          <p>Abilities:</p>
          <ul>
            {selectedPokemon?.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PokeApp;
