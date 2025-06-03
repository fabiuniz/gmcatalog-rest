const { useState, useEffect } = React;
    // Componente StarRatingDisplay
    function StarRatingDisplay({ initialRating, onRatingChange, readOnly = false }) {
        const [score, setRating] = useState(initialRating || 0);
        const [hover, setHover] = useState(0);

        useEffect(() => {
            setRating(initialRating || 0);
        }, [initialRating]);

        const handleClick = (index) => {
            if (readOnly) return;
            setRating(index);
            if (onRatingChange) {
                onRatingChange(index);
            }
        };

        return (
            <div className="flex justify-center items-center">
                {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                        <button
                            key={index}
                            className={`text-3xl ${index <= (hover || score) ? "text-yellow-400" : "text-gray-400"}`}
                            onClick={() => handleClick(index)}
                            onMouseEnter={() => !readOnly && setHover(index)}
                            onMouseLeave={() => !readOnly && setHover(score)}
                            disabled={readOnly}
                            style={{ background: 'none', border: 'none', cursor: readOnly ? 'default' : 'pointer' }}
                        >
                            &#9733; {/* Unicode for a star character */}
                        </button>
                    );
                })}
            </div>
        );
    }
    // Component for the entire app
    function App() {
      const [games, setGames] = useState([]); // Todos os jogos
      const [gameLists, setGameLists] = useState([]); // Todas as listas de jogos
      const [selectedGame, setSelectedGame] = useState(null); // Jogo detalhado selecionado
      const [selectedList, setSelectedList] = useState(null); // Lista de jogos selecionada
      const [listGames, setListGames] = useState([]); // Jogos da lista selecionada
      const [error, setError] = useState(null);
      // NOVO ESTADO: Controla se o formulário de adicionar jogo está visível
      const [showAddGameForm, setShowAddGameForm] = useState(false);
      // NOVO ESTADO: Controla se o formulário de edição de jogo está visível
      const [showEditGameForm, setShowEditGameForm] = useState(false);
      // NOVO ESTADO: Armazena os dados do jogo que está sendo editado
      const [editingGame, setEditingGame] = useState(null);

      // Backend API base URL (now relative since front-end and back-end are on the same origin)
      const API_BASE_URL = "";

      // Fetch all games and lists on mount
      useEffect(() => {
        setError(null);
        fetch(`${API_BASE_URL}/games`)
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch games");
            return res.json();
          })
          .then(data => setGames(data))
          .catch(err => {
            console.error("Error fetching games:", err);
            setError("Unable to load games. Please ensure the backend is running.");
          });

        fetch(`${API_BASE_URL}/lists`)
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch lists");
            return res.json();
          })
          .then(data => setGameLists(data))
          .catch(err => {
            console.error("Error fetching lists:", err);
            setError("Unable to load lists. Please ensure the backend is running.");
          });
      }, []);

      // Fetch games for a selected list
      useEffect(() => {
        if (selectedList) {
          fetch(`${API_BASE_URL}/lists/${selectedList.id}/games`)
            .then(res => {
              if (!res.ok) throw new Error("Failed to fetch list games");
              return res.json();
            })
            .then(data => setListGames(data))
            .catch(err => {
              console.error("Error fetching list games:", err);
              setError("Unable to load games for this list.");
            });
        }
      }, [selectedList]);

      // Fetch game details when a game is clicked
      const handleGameClick = (gameId) => {
        setSelectedList(null);
        setShowAddGameForm(false); // Esconde o formulário ao ver detalhes do jogo
        setError(null);
        fetch(`${API_BASE_URL}/games/${gameId}`)
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch game details");
            return res.json();
          })
          .then(data => setSelectedGame(data))
          .catch(err => {
            console.error("Error fetching game details:", err);
            setError("Unable to load game details.");
          });
      };

      // Handle list selection
      const handleListClick = (list) => {
        setSelectedList(list);
        setSelectedGame(null);
        setShowAddGameForm(false); // Esconde o formulário ao selecionar uma lista
        setShowEditGameForm(false); // Esconde o formulário de edição
        setEditingGame(null); // Limpa o jogo em edição
        setError(null);
      };

      // Handle game reordering in a list
      const handleMove = (sourceIndex, destinationIndex) => {
        if (!selectedList) return;

        setError(null);
        fetch(`${API_BASE_URL}/lists/${selectedList.id}/replacement`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceIndex, destinationIndex }),
        })
          .then(res => {
            if (!res.ok) throw new Error("Failed to move game");
            return fetch(`${API_BASE_URL}/lists/${selectedList.id}/games`);
          })
          .then(res => res.json())
          .then(data => setListGames(data))
          .catch(err => {
            console.error("Error moving game:", err);
            setError("Unable to reorder games.");
          });
      };

      const [newGame, setNewGame] = useState({
          title: "",
          year: "",
          genre: "",
          platforms: "",
          score: "",
          imgUrl: "",
          shortDescription: "",
          longDescription: ""
      });

      const handleInputChange = (e) => {
          const { name, value } = e.target;
          // Se estiver editando, atualiza o estado de editingGame
          if (showEditGameForm) {
            setEditingGame({ ...editingGame, [name]: value });
          } else { // Caso contrário, atualiza o estado de newGame (para adicionar)
            setNewGame({ ...newGame, [name]: value });
          }
      };

      const handleSubmit = (e) => {
          e.preventDefault();
          setError(null);
          fetch(`${API_BASE_URL}/games`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  ...newGame,
                  year: parseInt(newGame.year),
                  score: parseFloat(newGame.score)
              })
          })
              .then(res => {
                  if (!res.ok) throw new Error("Failed to create game");
                  return res.json();
              })
              .then(data => {
                  setGames([...games, data]);
                  setNewGame({
                      title: "",
                      year: "",
                      genre: "",
                      platforms: "",
                      score: "",
                      imgUrl: "",
                      shortDescription: "",
                      longDescription: ""
                  });
                  // Após adicionar, volta para a lista de todos os jogos
                  setSelectedGame(null);
                  setSelectedList(null);
                  setShowAddGameForm(false); // Esconde o formulário
              })
              .catch(err => {
                  console.error("Error creating game:", err);
                  setError("Unable to create game.");
              });
      };

      // Função para mostrar o formulário de adicionar jogo
      const handleShowAddGameForm = () => {
          setSelectedGame(null);
          setSelectedList(null);
          setShowEditGameForm(false); // Esconde o formulário de edição
          setEditingGame(null); // Limpa o jogo em edição
          setShowAddGameForm(true); // Exibe o formulário de adicionar
      };

  // Função para mostrar o formulário de edição de jogo
      const handleShowEditGameForm = () => {
        if (!selectedGame) {
          setError("No game selected for editing.");
          return;
        }
        // Preenche o estado editingGame com os dados do jogo selecionado
        setEditingGame({ ...selectedGame });
        setShowAddGameForm(false); // Esconde o formulário de adicionar
        setShowEditGameForm(true); // Exibe o formulário de edição
      };
    
      // Função para enviar os dados de edição do jogo
      const handleUpdateGame = async (e) => {
        e.preventDefault();
        if (!editingGame || !editingGame.id) {
          setError("No game selected for update.");
          return;
        }
    
        try {
          const response = await fetch(`${API_BASE_URL}/games/${editingGame.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...editingGame,
              year: parseInt(editingGame.year),
              score: parseFloat(editingGame.score)
            }),
          });
    
          if (!response.ok) {
            throw new Error("Failed to update game");
          }
    
          const updatedGameData = await response.json();
          
          // Atualiza a lista de todos os jogos
          setGames(games.map(game => 
            game.id === updatedGameData.id ? updatedGameData : game
          ));
          
          // Atualiza o jogo selecionado para mostrar os dados atualizados
          setSelectedGame(updatedGameData);
          
          setShowEditGameForm(false); // Esconde o formulário de edição
          setEditingGame(null); // Limpa o jogo em edição
          setError(null); // Limpa qualquer erro anterior
          alert("Game updated successfully!");
    
        } catch (err) {
          console.error("Error updating game:", err);
          setError("Unable to update game. Please try again.");
        }
      };
    
      // Função para voltar à tela de todos os jogos
      const handleShowAllGames = () => {
          setSelectedGame(null);
          setSelectedList(null);
          setShowAddGameForm(false); // Esconde o formulário
          setShowEditGameForm(false); // Esconde o formulário de edição
          setEditingGame(null); // Limpa o jogo em edição
        };
      
      // Função para apagar jogo
      const handleDeleteGame = async () => {
        if (!selectedGame || !selectedGame.id) {
          setError("No game selected for deletion.");
          return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete "${selectedGame.title}"?`);
        if (!confirmDelete) {
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/games/${selectedGame.id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete game");
          }

          // Atualiza o estado removendo o jogo deletado
          setGames(games.filter(game => game.id !== selectedGame.id));
          setSelectedGame(null); // Limpa o jogo selecionado
          setError(null); // Limpa qualquer erro anterior
          alert("Game deleted successfully!");
        } catch (err) {
          console.error("Error deleting game:", err);
          setError("Unable to delete game. Please try again.");
        }
      };

      const handleRatingChange = async (gameId, newRating) => {
          console.log(`Tentando enviar avaliação para o gameId: ${gameId} com rating: ${newRating}`); // ADICIONE ESTA LINHA
          setError(null);
          try {
              const response = await fetch(`${API_BASE_URL}/games/${gameId}/rating`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({gameId: gameId, score: newRating }),
              });
              if (!response.ok) {
                  throw new Error("Failed to update rating");
              }
              const updatedGame = await response.json();
              // Atualiza o jogo na lista de todos os jogos
              setGames(games.map(game =>
                  game.id === updatedGame.id ? updatedGame : game
              ));
              // Se o jogo avaliado for o jogo selecionado, atualiza o selectedGame
              if (selectedGame && selectedGame.id === updatedGame.id) {
                  setSelectedGame(updatedGame);
              }
              alert("Rating updated successfully!");
          } catch (err) {
              console.error("Error updating rating:", err);
              setError("Unable to update rating. Please try again.");
          }
      };

      return (
        <div className="flex h-screen">
          {/* Sidebar for game lists */}
          <div className="w-1/4 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Game Lists</h2>
            {/* Opção para inserir jogos */}
            <div
              className={`p-2 mb-2 rounded cursor-pointer ${showAddGameForm ? "bg-gray-600" : "bg-gray-700"} hover:bg-gray-600`}
              onClick={handleShowAddGameForm}
            >
              New Game
            </div>
            {/* Opção para ver todos os jogos */}
            <div
              className={`p-2 mb-2 rounded cursor-pointer ${!selectedList && !selectedGame && !showAddGameForm && !showEditGameForm ? "bg-gray-600" : "bg-gray-700"} hover:bg-gray-600`}
              onClick={handleShowAllGames}
            >
              All Games
            </div>
            {gameLists.map(list => (
              <div
                key={list.id}
                className={`p-2 mb-2 rounded cursor-pointer ${selectedList?.id === list.id ? "bg-gray-600" : "bg-gray-700"} hover:bg-gray-600`}
                onClick={() => handleListClick(list)}
              >
                {list.name}
              </div>
            ))}
          </div>

          {/* Main content area */}
          <div className="w-3/4 p-6">
            <h1 className="text-3xl font-bold mb-6">Game Catalog</h1>
            {error && <div className="text-red-500 p-4">{error}</div>}

            {/* RENDERIZAÇÃO CONDICIONAL */}
            {showAddGameForm ? ( // SE showAddGameForm é true, mostra o formulário
              <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-2xl font-semibold mb-4">Add New Game</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="title"
                        value={newGame.title}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="year"
                        value={newGame.year}
                        onChange={handleInputChange}
                        placeholder="Year"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="genre"
                        value={newGame.genre}
                        placeholder="Genre"
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="platforms"
                        value={newGame.platforms}
                        onChange={handleInputChange}
                        placeholder="Platforms"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="score"
                        value={newGame.score}
                        onChange={handleInputChange}
                        placeholder="Score"
                        step="0.1"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="imgUrl"
                        value={newGame.imgUrl}
                        onChange={handleInputChange}
                        placeholder="Image URL"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="shortDescription"
                        value={newGame.shortDescription}
                        onChange={handleInputChange}
                        placeholder="Short Description"
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="longDescription"
                        value={newGame.longDescription}
                        onChange={handleInputChange}
                        placeholder="Long Description"
                        className="p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded col-span-2"
                    >
                        Add Game
                    </button>
                </form>
              </div>
        ) : showEditGameForm ? ( // SE showEditGameForm é true, mostra o formulário de edição
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-2xl font-semibold mb-4">Edit Game: {editingGame?.title}</h2>
            {editingGame && (
              <form onSubmit={handleUpdateGame} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  value={editingGame.title || ''}
                  onChange={handleInputChange}
                  placeholder="Title"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="year"
                  value={editingGame.year || ''}
                  onChange={handleInputChange}
                  placeholder="Year"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="genre"
                  value={editingGame.genre || ''}
                  placeholder="Genre"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="platforms"
                  value={editingGame.platforms || ''}
                  onChange={handleInputChange}
                  placeholder="Platforms"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="score"
                  value={editingGame.score || ''}
                  onChange={handleInputChange}
                  placeholder="Score"
                  step="0.1"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="imgUrl"
                  value={editingGame.imgUrl || ''}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="shortDescription"
                  value={editingGame.shortDescription || ''}
                  onChange={handleInputChange}
                  placeholder="Short Description"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="longDescription"
                  value={editingGame.longDescription || ''}
                  onChange={handleInputChange}
                  placeholder="Long Description"
                  className="p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded col-span-2"
                >
                  Update Game
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditGameForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded col-span-2"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
            ) : selectedGame ? ( // SE selectedGame é true, mostra os detalhes do jogo
              <div className="bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-semibold mb-4">{selectedGame.title}</h2>
                <img src={selectedGame.imgUrl} alt={selectedGame.title} className="w-48 h-48 object-cover mb-4" />
                <p><strong>Year:</strong> {selectedGame.year}</p>
                <p><strong>Genre:</strong> {selectedGame.genre}</p>
                <p><strong>Platforms:</strong> {selectedGame.platforms}</p>
                <p><strong>Score:</strong> {selectedGame.score}</p>
                <p><strong>Short Description:</strong> {selectedGame.shortDescription}</p>
                <p><strong>Long Description:</strong> {selectedGame.longDescription}</p>
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Rate this Game:</h3>
                    <StarRatingDisplay
                        initialRating={selectedGame.score || 0}
                        onRatingChange={(newRating) => handleRatingChange(selectedGame.id, newRating)}
                    />
                    {selectedGame.score !== null && selectedGame.score !== undefined && (
                        <p className="text-center mt-2">Current Rating: {selectedGame.score.toFixed(1)} stars</p>
                    )}
                </div>
                <div className="mt-4 flex space-x-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={handleShowAllGames}
                >
                  Back to All Games
                </button>                
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                  onClick={handleShowEditGameForm}
                >
                    Edit
                </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={handleDeleteGame}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : selectedList ? ( // SE selectedList é true, mostra a lista de jogos
              <>
                <h2 className="text-2xl font-semibold mb-4">{selectedList.name}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {listGames.map((game, index) => (
                    <div key={game.id} className="flex items-center bg-white p-4 rounded shadow">
                      <img src={game.imgUrl} alt={game.title} className="w-16 h-16 object-cover mr-4" />
                      <div
                        className="flex-grow bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                        onClick={() => handleGameClick(game.id)}
                      >
                        <h3 className="text-lg font-semibold">{game.title} ({game.year})</h3>
                        <p className="text-gray-600">{game.shortDescription}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded disabled:bg-gray-400"
                          onClick={() => handleMove(index, index - 1)}
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded disabled:bg-gray-400"
                          onClick={() => handleMove(index, index + 1)}
                          disabled={index === listGames.length - 1}
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : ( // Caso contrário (nem selectedGame, nem selectedList, nem showAddGameForm, nem showEditGameForm), mostra a lista de todos os jogos
              <div className="grid grid-cols-2 gap-4">
                {games.map(game => (
                  <div
                    key={game.id}
                    className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                    onClick={() => handleGameClick(game.id)}
                  >
                    <img src={game.imgUrl} alt={game.title} className="w-32 h-32 object-cover mb-2 mx-auto" />
                    <h3 className="text-lg font-semibold">{game.title} ({game.year})</h3>
                    <p className="text-gray-600">{game.shortDescription}</p>
                    <div className="flex justify-center items-center mt-2">
                        {/* Adicione este console.log */}
                        {console.log(`Game: ${game.title}, Score:`, game.score)}
                        <StarRatingDisplay initialRating={game.score || 0} readOnly={true} />
                        {game.score !== null && game.score !== undefined && (
                            <span className="ml-2 text-gray-700">({game.score.toFixed(1)})</span>
                        )}
                    </div>
                  </div>
                ))}
          </div>
        )}
          </div>
        </div>
      );
    }

    // Render the app using createRoot
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);