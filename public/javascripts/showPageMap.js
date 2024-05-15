mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/navigation-day-v1',
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 11// starting zoom
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}</p>`
        )
    )
    .addTo(map);

// const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
//     .setLngLat([-74.34, 39.89])
//     .addTo(map);