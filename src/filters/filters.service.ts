import { FilterDto } from './dto/filter.dto';

export class FiltersService {
    constructor(private readonly filterDto: FilterDto) { }

    getQuery(): Object {
        //Filtro de consulta campo:valor (selección)
        let queryObj = {};
        if (this.filterDto.query) {
            const queryProperties = this.filterDto.query.split(',');
            queryProperties.forEach(function (property) {
                const tup = property.split(/:(.+)/);
                const key = tup[0].split(/__(.+)/);
                if (key[1]) {
                    switch (key[1]) {
                        case "icontains":
                            queryObj[key[0]] = { $regex: new RegExp(tup[1], 'i') }
                            break;
                        case "contains":
                            queryObj[key[0]] = { $regex: new RegExp(tup[1]) }
                            break;
                        case "gt":
                            queryObj[key[0]] = { $gt: castValue(tup[1]) }
                            break;
                        case "gte":
                            queryObj[key[0]] = { $gte: castValue(tup[1]) }
                            break;
                        case "lt":
                            queryObj[key[0]] = { $lt: castValue(tup[1]) }
                            break;
                        case "lte":
                            queryObj[key[0]] = { $lte: castValue(tup[1]) }
                            break;
                        case "in":
                            let list = tup[1].split('|')
                            queryObj[key[0]] = { $in: [...list.map(v => castValue(v))] }
                            break;
                        case "not":
                            queryObj[key[0]] = { $ne: castValue(tup[1]) }
                            break;
                        case "inarray":
                            queryObj[key[0]] = { $in: [castValue(tup[1])] }
                            break;
                        case "isnull":
                            if (tup[1].toLowerCase() === 'true') {
                                queryObj[key[0]] = null;    
                            } else {
                                queryObj[key[0]] = { $ne: null }
                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    queryObj[key[0]] = castValue(tup[1]);
                }
            });
        }
        return queryObj;
    }

    getFields(): Object {
        //Filtro de consulta por campo (proyección)
        let fieldsObj = {};
        if (this.filterDto.fields) {
            let fieldsProperties = this.filterDto.fields.split(',');
            fieldsProperties.forEach(function (property) {
                fieldsObj[property] = 1;
            });
        }
        return fieldsObj
    }

    getSortBy(): any[]{
        //Filtro de ordenamiento
        let sortbyArray = [];
        if (this.filterDto.sortby) {
            let sortbyProperties = this.filterDto.sortby.split(',');
            if (this.filterDto.order) {
                let orderProperties = this.filterDto.order.split(',');
                if (orderProperties.length == 1) {//Si order solo contiene un valor ordena todos los campos de acuerdo al mismo
                    let orderTerm = (this.filterDto.order == 'desc') ? -1 : 1;
                    sortbyProperties.forEach(function (property) {
                        sortbyArray.push([property, orderTerm]);
                    });
                } else if (sortbyProperties.length == orderProperties.length) {//Si order y sortby tienen el mismo tamaño, se ordena cada campo de acuerdo al orden específico
                    for (let i = 0; i < sortbyProperties.length; i++) {
                        sortbyArray.push([sortbyProperties[i], (orderProperties[i] == 'desc' ? -1 : 1)]);
                    }
                } else {//Si order y sortby tienen tamaños diferentes, se ignora el orden definido y se ordena de forma ascendente
                    sortbyProperties.forEach(function (property) {
                        sortbyArray.push([property, 1]);
                    });
                }
            } else {//Si order no está definido, por defecto todos los campos son ordenados ascendentemente
                sortbyProperties.forEach(function (property) {
                    sortbyArray.push([property, 1]);
                });
            }
        }
        return sortbyArray;
    }

    getLimitAndOffset(): Object{            
        return {
            skip: parseInt(this.filterDto.offset !== undefined ? this.filterDto.offset : '0'),
            limit: parseInt(this.filterDto.limit !== undefined ? this.filterDto.limit : '10'),
        };
    }

    isPopulated(): boolean{            
        return this.filterDto.populate === 'true';
    }
}

function castValue(value: string): any {
    if (value) {
        const datatype = value.match(/<[^>]+>/);
        if (datatype === null) {
            return value;
        } else {
            const val = value.slice(0, value.length-3)
            switch (datatype[0][1]) {
                case 'n':
                    return Number(val);
                    break;
                case 'd':
                    return new Date(val);
                    break;
                case 'b':
                    return value.toLowerCase() === 'true';
                    break;
                default:
                    break;
            }
        }
    } else {
        return null;
    }
}