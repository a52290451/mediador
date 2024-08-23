import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { FiltersService } from 'src/filters/filters.service';
import { FilterDto } from 'src/filters/dto/filter.dto';
import { RecursoDto as MainDto, Recurso as MainModel } from '../models/recurso.dtoSchema';
import { Curso} from 'src/models/curso.dtoSchema';

@Injectable()
export class RecursoService {
    constructor(
        @InjectModel(MainModel.name)
        private readonly mainModel: Model<MainModel>,

        // ? inyectar modelos relacionados para verificar existencia y popular
        @InjectModel(Curso.name)
        private readonly cursoModel: Model<Curso>
    ) {}

    /**
     * Revisa si los _ids de las colecciones relacionadas existen.
     * Detiene el post o put si no hay concordancia.
     * ? Agregar demás comprobaciones si se añaden más relaciones.
     * @param mainDto - modelo dto que se desea verificar.
     */
    private async checkRelated(mainDto: MainDto) {
        if (mainDto.curso_id) {
            const cursoId = await this.cursoModel.exists({ _id: mainDto.curso_id });
            if (!cursoId) {
                throw new Error(`curso_id: ${mainDto.curso_id} doesn't exist`);
            }
        }
    }

    /**
     * Retorna la lista de colecciones a popular segun relación con la coleción actual.
     * ? Agregar aquí si se relacionan más colecciones.
     */
    private populatefields(): any[] {
        return [
            { path: Curso.name + 'Id' },
        ]
    }

    // ? funciones REST generalizadas
    async post(mainDto: MainDto): Promise<MainDto> { // Cambiado el tipo de retorno a MainDto
        const dateNow = new Date();
        const newdoc = new this.mainModel(mainDto);
        newdoc.fecha_creacion = dateNow;
        newdoc.fecha_modificacion = dateNow;
        await this.checkRelated(newdoc);
        const savedDoc = await newdoc.save();
        return savedDoc.toObject() as MainDto; // Convertir a MainDto
    }

    async getAll(filterDto: FilterDto): Promise<MainDto[]> {
        const filterService = new FiltersService(filterDto);
        let populatefields = [];
        if (filterService.isPopulated()) {
            populatefields = this.populatefields();
        }
        return await this.mainModel.find(
            filterService.getQuery(),
            filterService.getFields(),
            filterService.getLimitAndOffset()
        ).sort(
            filterService.getSortBy()
        ).populate(populatefields);
    }

    async getById(_id: string): Promise<MainDto> {
        const doc = await this.mainModel.findById(_id);
        if (!doc) {
            throw new Error(`${_id} doesn't exist`);
        }
        return doc;
    }

    async put(_id: string, mainDto: MainDto): Promise<MainDto> {
        mainDto.fecha_modificacion = new Date();
        if (mainDto.fecha_creacion) {
            delete mainDto.fecha_creacion;
        }
        await this.checkRelated(mainDto);
        return await this.mainModel.findByIdAndUpdate(_id, mainDto, { new: true });
    }

    async delete(_id: string): Promise<MainDto> {
        //const deleted = await this.mainModel.findByIdAndDelete(_id);
        const deleted = await this.mainModel.findByIdAndUpdate(_id, { activo: false }, { new: true });
        if (!deleted) {
            throw new Error(`${_id} doesn't exist`);
        }
        return deleted;
    }

    // Implementación del método deleteAll
    async deleteAll(): Promise<{ deletedCount: number }> {
        const result = await this.mainModel.deleteMany({});
        return { deletedCount: result.deletedCount };
    }
}