const getMensajeSistema = (comando = '') => ({
  smsrowner: `*〘 ${comando} 〙 es una función exclusiva de los propietarios principales. Tu acceso no está autorizado.*`,
  smsowner: `*〘 ${comando} 〙 solo puede ser ejecutado por los desarrolladores. No tienes los permisos necesarios.*`,
  smsmods: `*〘 ${comando} 〙 está reservado para moderadores. Tu perfil no cumple con los requisitos.*`,
  smspremium: `*〘 ${comando} 〙 es un beneficio exclusivo para usuarios premium. Este privilegio aún no te corresponde.*`,
  smsgroup: `*〘 ${comando} 〙 solo está disponible en grupos. Este entorno no es válido.*`,
  smsprivate: `*〘 ${comando} 〙 debe utilizarse en un chat privado. Intenta de nuevo en el canal adecuado.*`,
  smsadmin: `*〘 ${comando} 〙 requiere permisos de administrador. Acceso denegado.*`,
  smsbotAdmin: `*Para ejecutar 〘 ${comando} 〙, el bot necesita ser administrador. Por favor, actualiza los permisos.*`,
  smsrestrict: `*Esta función está desactivada. No se permiten excepciones.*`
})