import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Card from "./Card";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

const Deck = () => {
    const [deck, setDeck] = useState(null), [drawn, setDrawn] = useState([]), [isShuffling, setIsShuffling] = useState(false);

    useEffect(function loadDeckFromAPI() {
        async function fetchData() {
          const d = await axios.get(`${BASE_URL}/new/shuffle/`);
          setDeck(d.data);
        }
        fetchData();
      }, []);
    
      const draw = async () => {
        try {
          const drawRes = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/`);
    
          if (drawRes.data.remaining === 0) throw new Error("Deck empty!");
    
          const card = drawRes.data.cards[0];
    
          setDrawn(d => [
            ...d,
            {
              id: card.code,
              name: card.suit + " " + card.value,
              image: card.image,
            },
          ]);
        } catch (err) {
          alert(err);
        }
      }

      const startShuffling = async () => {
        setIsShuffling(true);
        try {
          await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle/`);
          setDrawn([]);
        } catch (err) {
          alert(err);
        } finally {
          setIsShuffling(false);
        }
      }
    
      const renderDrawBtnIfOk = () => {
        if (!deck) return null;
    
        return (
          <button
            className="Deck-gimme"
            onClick={draw}
            disabled={isShuffling}>
            DRAW
          </button>
        );
      }
    
      const renderShuffleBtnIfOk = () => {
        if (!deck) return null;
        return (
          <button
            className="Deck-gimme"
            onClick={startShuffling}
            disabled={isShuffling}>
            SHUFFLE DECK
          </button>
        );
      }
    
      return (
        <main className="Deck">
    
          {renderDrawBtnIfOk()}
          {renderShuffleBtnIfOk()}
    
          <div className="Deck-cardarea">{
            drawn.map(c => (
              <Card key={c.id} name={c.name} image={c.image} />
            ))}
          </div>
    
        </main>
      );
}

export default Deck