const maplists = [
    {
        id: 0,
        mapName: 'Shape',
        url: "/api/mapList",
    },
    {
        id: 1,
        mapName: 'cartoDB',
        attr:'&copy; <a href="https://carto.com/">cartoDB</a>',
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    },
    {
        id: 2,
        mapName: 'cartoDB Dark',
        attr:'&copy; <a href="https://carto.com/">cartoDB</a>',
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    },
    {
        id: 3,
        mapName: 'cartoDB Light',
        attr:'&copy; <a href="https://carto.com/">cartoDB</a>',
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    },
    {
        id: 4,
        mapName: 'OpenStreetMap',
        attr:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    }
]

export default maplists;