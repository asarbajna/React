import React, { useEffect, useState } from 'react';

function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Fetch 10 random images from Lorem Picsum
    fetch('https://picsum.photos/v2/list?page=1&limit=10')
      .then(response => response.json())
      .then(data => setPhotos(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>📷 Random Picsum Photos</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {photos.map(photo => (
          <div key={photo.id} style={{ width: '200px' }}>
            <img
              src={`https://picsum.photos/id/${photo.id}/200/200`}
              alt={photo.author}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <p style={{ textAlign: 'center' }}>{photo.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
