import { Request, Response, Express } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Orphanage from '../models/Orphanage'
import OrphanagesView from '../views/orphanagesView'

class OrphanageController {
  async create (req: Request, res: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours
    } = req.body

    var open_on_weekends = req.body.open_on_weekends

    if (open_on_weekends === 'true') {
      open_on_weekends = true
    } else {
      open_on_weekends = false
    }

    const orphanagesRepository = getRepository(Orphanage)

    const requestImages = req.files as Express.Multer.File[]

    const images = requestImages.map(file => {
      return { path: file.filename }
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required().max(200),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required()
      }))
    })

    await schema.validate(data, { abortEarly: false })

    const orphanage = orphanagesRepository.create(data)
    await orphanagesRepository.save(orphanage)

    return res.sendStatus(201)
  }

  async index (req: Request, res: Response) {
    const orphanagesRepository = getRepository(Orphanage)

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    })

    res.json(OrphanagesView.renderMany(orphanages))
  }

  async show (req: Request, res: Response) {
    const id = req.params.id

    const orphanagesRepository = getRepository(Orphanage)

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    })

    res.json(OrphanagesView.render(orphanage))
  }
}

const orphanageController = new OrphanageController()

export { orphanageController }
