import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FiPlus } from "react-icons/fi";

import Sidebar from "../components/Siddebar";

import mapIcon from "../utils/mapIcon";
import '../styles/pages/create-orphanage.css';
import { LeafletMouseEvent } from 'leaflet'
import api from "../services/api";

interface CoordinateProps {
  latitude: number
  longitude: number
}

export default function CreateOrphanage() {
  const [coordinates, setCoordinates] = useState<CoordinateProps>({latitude: 0, longitude: 0})

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagesPreview, setImagesPreview] = useState<string[]>([])

  function handleMapClick(event: LeafletMouseEvent){
    setCoordinates({
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    })
  }

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files){
      return
    }
    const selectedImages = Array.from(event.target.files)
    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })

    setImagesPreview(selectedImagesPreview)
  }

  function handleSubmit(event: FormEvent){
    event.preventDefault()
    console.log(coordinates)
    const data = new FormData()

    data.append('name', name)
    data.append('about', about)
    data.append('latitude', String(coordinates.latitude))
    data.append('longitude', String(coordinates.longitude))
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))

    images.forEach(image => {
      data.append('images', image)
    })

    api.post('/orphanages', data).then(response => {
      setName("")
      setAbout("")
      setInstructions("")
      setOpeningHours("")
      setOpenOnWeekends(false)
      setImages([])
      setImagesPreview([])
      setImages([])
    })
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>
            
            <Map 
              center={[-5.0613467000,-42.7998716000]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
              >
              <TileLayer 
                url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
              />

              {coordinates.latitude != 0 && (
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[coordinates.latitude, coordinates.longitude]} 
                /> 
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={(event) => setAbout(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                { imagesPreview.map(image => {
                  return (
                    <img key={image} src={image} className="new-image" alt={name} />
                  )
                }) }
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

                <input multiple type="file" id="image[]" onChange={handleImageSelection} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={(event) => setInstructions(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={(event) => setOpeningHours(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" className={ open_on_weekends ? "active" : ""} onClick={() => setOpenOnWeekends(true)} >Sim</button>
                <button type="button" className={ !open_on_weekends ? "active" : "" } onClick={() => setOpenOnWeekends(false)} >Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

