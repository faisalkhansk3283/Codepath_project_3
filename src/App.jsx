import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS

function App() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreedIndex, setSelectedBreedIndex] = useState(0);
  const [catImages, setCatImages] = useState([]);
  const [storedValues, setStoredValues] = useState([]);
  const [showStoredValueDescription, setShowStoredValueDescription] = useState(false);
  const [displayedCats, setDisplayedCats] = useState([]);

  useEffect(() => {
    fetch('https://api.thecatapi.com/v1/breeds?limit=10')
      .then((response) => response.json())
      .then((data) => {
        setBreeds(data);
      })
      .catch((error) => {
        console.error('Error fetching breeds:', error);
      });
  }, []);

  useEffect(() => {
    if (breeds.length > 0) {
      const selectedBreed = breeds[selectedBreedIndex];
      if (selectedBreed) {
        fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreed.id}`)
          .then((response) => response.json())
          .then((data) => {
            setCatImages(data);
          })
          .catch((error) => {
            console.error('Error fetching cat images:', error);
          });
      }
    }
  }, [breeds, selectedBreedIndex]);

  const handleNext = () => {
    setSelectedBreedIndex((prevIndex) => (prevIndex + 1) % breeds.length);
    setShowStoredValueDescription(false);

    if (catImages.length > 0) {
      const newDisplayedCat = {
        name: breeds[selectedBreedIndex]?.name || '',
        image: catImages[0].url,
      };
      setDisplayedCats([...displayedCats, newDisplayedCat]);
    }
  };

  const handleCategoryClick = (category) => {
    const selectedBreed = breeds[selectedBreedIndex];
    if (selectedBreed) {
      let value;
      if (category === 'breed') {
        value = selectedBreed.name;
      } else if (category === 'weight') {
        value = selectedBreed.weight.metric;
      } else if (category === 'origin') {
        value = selectedBreed.origin;
      }

      if (value) {
        setStoredValues((prevValues) => {
          if (!prevValues.includes(value)) {
            return [...prevValues, value];
          }
          return prevValues;
        });
      }
    }
  };

  const handleRemoveValue = (value) => {
    // Filter out the clicked value and create a new array
    const updatedValues = storedValues.filter((v) => v !== value);
    setStoredValues(updatedValues);
  };

  const renderCategoryButtons = () => {
    return ['breed', 'weight', 'origin'].map((category) => (
      <button key={category} onClick={() => handleCategoryClick(category)}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </button>
    ));
  };

  const renderStoredValues = () => {
    return (
      <div className="stored-values">
        <h2>Stored Values</h2>
        <div>
          {storedValues.map((value, index) => (
            <button key={index} onClick={() => handleRemoveValue(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCatImages = () => {
    return catImages.map((catImage) => (
      <div key={catImage.id} className="cat-container">
        <img src={catImage.url} alt="Cat" />
      </div>
    ));
  };

  return (
    <div className="app-container">
      <div className="header">
        {renderStoredValues()}
      </div>
      <div className="main-column">
        <h1>Cat Images by API</h1>
        <div className="category-buttons">
          {renderCategoryButtons()}
        </div>
        <div className="cat-image-panel">
          {renderCatImages()}
          <div className="next-button">
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      </div>

      <div className="displayed-cats">
        <h2>Displayed Cats</h2>
        {displayedCats.map((cat, index) => (
          <div key={index} className="displayed-cat">
            <p>{cat.name}</p>
            <img src={cat.image} alt={cat.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
