export const Constants = {
  estados: [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Coahuila",
    "Colima",
    "Chiapas",
    "Chihuahua",
    "Distrito Federal",
    "Durango",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "México",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
  ],
  DateFormat: 'dd/MM/yyyy',
  FullDateFormat: 'dd/MM/yyyy hh:mm a',
  Status: [
    "APPROVED",
    "DENIED",
    "PENDING"
  ]

}

export const Request = {
  post: "POST",
  put: "PUT",
  get: "GET",
  delete: "DELETE"
}

export enum Respuesta {
  Si = "si",
  No = "no"
}

/*
* Independiente = 1
* Empresa = 2
*/

export enum Actividad {
  Independiente = "Técnico Independiente",
  Empresa = "Empresa de Mtto. y Servicio"
}





