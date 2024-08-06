import { ApiProperty} from '@nestjs/swagger';

export class CursoDto {

    @ApiProperty()
    readonly nombre_curso: string;

    @ApiProperty()
    readonly periodo_academico: string

    @ApiProperty()
    readonly oferta: string;

    @ApiProperty()
    fecha_creacion: Date;

    @ApiProperty()
    fecha_modificacion: Date;
}

import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({collection: 'curso'})
export class Curso extends Document {

    @Prop({required: true})
    nombre_curso: string

    @Prop({required: true})
    periodo_academico: string

    @Prop({required: true})
    oferta: string

    @Prop({required: true})
    fecha_creacion: Date

    @Prop({required: true})
    fecha_modificacion: Date
}

export const CursoSchema = SchemaFactory.createForClass(Curso);