import { ApiProperty} from '@nestjs/swagger';

export class RecursoDto {

    @ApiProperty()
    readonly curso_id: string;

    @ApiProperty()
    readonly nombre: string;

    @ApiProperty()
    readonly descripcion: string;

    @ApiProperty()
    documento: string;

    @ApiProperty()
    metadatos: object;

    @ApiProperty()
    activo: boolean;

    @ApiProperty()
    fecha_creacion: Date;

    @ApiProperty()
    fecha_modificacion: Date;
    
}

import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({collection: 'recurso'})
export class Recurso extends Document {

    @Prop({required: true})
    curso_id: string

    @Prop({required: true})
    nombre: string

    @Prop({required: true})
    descripcion: string

    @Prop({required: true})
    documento: string

    @Prop({required: true, type: Object})
    metadatos: object

    @Prop({required: true})
    activo: boolean

    @Prop({required: true})
    fecha_creacion: Date

    @Prop({required: true})
    fecha_modificacion: Date

}

export const RecursoSchema = SchemaFactory.createForClass(Recurso);