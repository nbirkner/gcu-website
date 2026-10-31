# GCU — Gestión de Condominios Urbanos

Sitio estático de una sola página (`index.html`) para GCU, administración de condominios en Escazú, Costa Rica. El dominio público es [https://www.gcucr.com/](https://www.gcucr.com/).

## Contacto publicado

Estos datos ya están en la página. No los cambie sin confirmar con Erika Alier Montealegre.

| Uso | Valor | Dónde |
| --- | --- | --- |
| Correo | [ealier@gcucr.com](mailto:ealier@gcucr.com) | Contacto, menú móvil y destino del formulario |
| Teléfono oficina | [2215-3150](tel:+50622153150) | Contacto y menú móvil |
| Celular | [8816-7645](tel:+50688167645) | Contacto y menú móvil |
| WhatsApp | [https://wa.me/50688167645](https://wa.me/50688167645) | Botón verde fijo. Es el mismo celular, con código de país 506 |

## Formulario «Solicitar propuesta»

El modal envía con [FormSubmit](https://formsubmit.co/) por AJAX. No hay backend propio.

- Endpoint: `https://formsubmit.co/ajax/ealier@gcucr.com`
- Destino: `ealier@gcucr.com`
- Campos ocultos: `_subject` = `Solicitud de propuesta — GCU`, `_captcha` = `false`
- Campos: `nombre`, `correo`, `telefono`, `condominio`, `mensaje`

FormSubmit puede pedir una confirmación la primera vez que recibe un envío a esa dirección. Si el formulario deja de llegar, revise la bandeja de `ealier@gcucr.com` (incluida la carpeta de spam) antes de cambiar el endpoint.

## SEO

- `robots.txt` permite el rastreo y apunta al sitemap.
- `sitemap.xml` incluye solo `https://www.gcucr.com/`.
- `index.html` declara canonical, Open Graph y Twitter Card. La imagen para compartir es `images/img-008.jpg`.
