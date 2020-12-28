export default function getKoppen(sign) {
    return <img src={`./koppen_map/${sign}.png` || `./koppen_map/${sign}.jpg`} alt={`Map for ${sign} climates`}/>
}