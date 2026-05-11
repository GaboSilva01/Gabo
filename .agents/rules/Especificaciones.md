**ESPECIFICACIONES TÉCNICAS**

**Plataforma de Cotización Web**

Empresa de Productos Plásticos

| Versión 1.0.0 | Fecha Mayo 2025 |
| :---: | :---: |

# **1\. Resumen Ejecutivo**

Este documento describe las especificaciones técnicas y funcionales para el desarrollo de una plataforma web de cotización de productos plásticos. La solución permite a los clientes seleccionar productos, personalizar cantidades y generar una cotización formal. La venta final se realiza a través de WhatsApp mediante un botón integrado al final de la cotización.

La autenticación de usuarios se gestiona mediante Supabase Auth, garantizando un acceso seguro y personalizado para cada cliente registrado.

## **Objetivos del Proyecto**

* Permitir a los clientes cotizar productos plásticos en línea de forma rápida y clara.

* Facilitar el cierre de ventas mediante un enlace directo a WhatsApp.

* Ofrecer autenticación segura con Supabase para personalizar la experiencia.

* Reducir la carga operativa del equipo de ventas en la generación de presupuestos.

## **Alcance**

| DENTRO del alcance | Catálogo de productos plásticos, cotizador interactivo, autenticación Supabase, botón de compra por WhatsApp, historial de cotizaciones por usuario |
| :---- | :---- |
| **FUERA del alcance** | Pasarela de pagos en línea, carrito de compras, gestión de inventario, despacho / logística |

# **2\. Stack Tecnológico**

La plataforma se construye sobre tecnologías modernas, escalables y de código abierto, optimizadas para velocidad de desarrollo y rendimiento en producción.

| Capa | Tecnología | Justificación |
| :---- | :---- | :---- |
| **Frontend** | Next.js 14 (App Router) | SSR/SSG para rendimiento SEO, enrutamiento nativo |
| **UI / Estilos** | Tailwind CSS \+ shadcn/ui | Diseño consistente, componentes accesibles |
| **Auth & DB** | Supabase | Auth, base de datos PostgreSQL y almacenamiento en la nube |
| **ORM** | Supabase JS Client | Consultas tipadas, Row Level Security nativa |
| **Estado Global** | Zustand | Manejo ligero del carrito de cotización |
| **Formularios** | React Hook Form \+ Zod | Validación robusta y experiencia de usuario fluida |
| **PDF Export** | react-pdf / jsPDF | Generación de cotización en PDF descargable |
| **Hosting** | Vercel | Deploy continuo, edge functions, CDN global |

# **3\. Arquitectura del Sistema**

La plataforma sigue una arquitectura de tres capas desacopladas: presentación (Next.js), lógica de negocio (API Routes / Server Actions) y datos (Supabase / PostgreSQL).

## **3.1 Flujo de Usuario Principal**

1. El cliente accede a la URL de la plataforma.

2. Si no tiene sesión activa, Supabase Auth presenta el formulario de login / registro.

3. Tras autenticarse, el cliente visualiza el catálogo de productos.

4. Selecciona productos y define cantidades; el cotizador calcula el total en tiempo real.

5. El cliente revisa el resumen de cotización con precios unitarios, subtotales e IVA.

6. Descarga la cotización en PDF (opcional).

7. Presiona el botón 'Comprar por WhatsApp' que genera un mensaje pre-llenado con el detalle de la cotización y abre WhatsApp.

## **3.2 Estructura de Base de Datos (Supabase / PostgreSQL)**

Tablas principales y sus relaciones:

| profiles | id (FK auth.users), nombre, empresa, telefono, created\_at |
| :---- | :---- |
| **productos** | id, nombre, descripcion, precio\_unitario, categoria, unidad, activo, imagen\_url |
| **cotizaciones** | id, usuario\_id (FK), fecha, subtotal, iva, total, estado, whatsapp\_enviado |
| **cotizacion\_items** | id, cotizacion\_id (FK), producto\_id (FK), cantidad, precio\_unitario, subtotal |
| **categorias** | id, nombre, descripcion, orden\_display |

# **4\. Autenticación con Supabase**

Supabase Auth gestiona el ciclo completo de autenticación. Se implementa con el proveedor de Email/Password como opción principal, con posibilidad de agregar OAuth (Google) en fases posteriores.

## **4.1 Flujo de Autenticación**

* Registro: El cliente completa email, contraseña y datos de empresa. Supabase crea el usuario en auth.users y se dispara un trigger para crear el registro en la tabla profiles.

* Verificación: Supabase envía un email de confirmación. Sin verificar, el acceso al cotizador está bloqueado.

* Login: El cliente introduce credenciales. Supabase genera un JWT que Next.js almacena en una cookie HttpOnly.

* Sesión persistente: El middleware de Next.js verifica el token en cada request y redirige al login si caduca.

* Recuperación de contraseña: Flujo estándar de Supabase con email de reseteo.

## **4.2 Row Level Security (RLS)**

Todas las tablas tienen RLS habilitado. Cada usuario solo puede leer y escribir sus propias cotizaciones. Los productos y categorías son de lectura pública para usuarios autenticados.

| Política clave | auth.uid() \= usuario\_id — garantiza que un cliente nunca acceda a cotizaciones ajenas. |
| :---- | :---- |

# **5\. Módulos Funcionales**

## **5.1 Catálogo de Productos**

Pantalla principal post-login. Muestra los productos agrupados por categoría con imagen, descripción, precio unitario y unidad de medida.

* Filtro por categoría (cuñetes, tapas, baldes, etc.).

* Búsqueda por nombre de producto.

* Cada tarjeta de producto muestra: imagen, nombre, descripción corta, precio unitario \+ IVA.

* Botón 'Agregar a Cotización' con selector de cantidad (input numérico con mínimo 1).

## **5.2 Carrito / Resumen de Cotización**

Panel lateral o página dedicada que muestra los ítems agregados en tiempo real.

* Lista de ítems: producto, cantidad, precio unitario, subtotal.

* Cálculo automático: subtotal, IVA (configurable), total.

* Posibilidad de editar cantidad o eliminar ítems.

* Campo opcional de 'Notas al vendedor'.

* Botón 'Generar Cotización' que crea el registro en Supabase y muestra la vista final.

## **5.3 Vista Final de Cotización**

Página de solo lectura con el resumen oficial de la cotización. Contiene:

* Encabezado: logo de la empresa, nombre del cliente, empresa, fecha y número de cotización.

* Tabla de ítems: producto, cantidad, precio unitario, subtotal.

* Totales: subtotal, IVA, total en moneda local.

* Vigencia de la cotización (configurable, por defecto 15 días).

* Botón 'Descargar PDF'.

* Botón prominente 'Comprar por WhatsApp' (detalle en sección 5.4).

## **5.4 Botón de Compra por WhatsApp**

Este es el CTA (Call to Action) principal. Al hacer clic, genera una URL de WhatsApp con el mensaje pre-configurado.

| Formato URL | https://wa.me/{NUMERO}?text={MENSAJE\_CODIFICADO} |
| :---- | :---- |

El mensaje incluye automáticamente:

* Saludo personalizado con nombre del cliente.

* Número de cotización para referencia.

* Listado de productos con cantidades.

* Total de la cotización.

* Solicitud de confirmar el pedido.

El número de WhatsApp de la empresa se configura en variables de entorno (.env).

## **5.5 Historial de Cotizaciones**

Sección accesible desde el menú de usuario. Lista todas las cotizaciones del cliente con:

* Número, fecha y total de cada cotización.

* Estado: Pendiente / En proceso / Completada.

* Botón para reabrir y reenviar cualquier cotización anterior por WhatsApp.

# **6\. Catálogo Inicial de Productos**

Se carga un catálogo mínimo para el lanzamiento. El administrador puede extenderlo directamente desde Supabase Studio o a través del panel de administración (fase 2).

| Producto | Unidad | Categoría | Precio ref. |
| :---- | :---- | :---- | :---- |
| Cuñete de pintura 19 L | Unidad | Cuñetes | Por definir |
| Tapa para cuñete 19 L | Unidad | Tapas | Por definir |
| Cuñete de pintura 4 L | Unidad | Cuñetes | Por definir |
| Tapa para cuñete 4 L | Unidad | Tapas | Por definir |
| Balde plástico 10 L | Unidad | Baldes | Por definir |
| Balde plástico 20 L | Unidad | Baldes | Por definir |
| Tapa para balde 10 L | Unidad | Tapas | Por definir |

# **7\. Estructura del Proyecto (Next.js)**

Organización de carpetas siguiendo las convenciones de Next.js 14 App Router:

| Ruta / Archivo | Descripción |
| :---- | :---- |
| app/page.tsx | Landing / redirección según sesión |
| app/(auth)/login/page.tsx | Formulario de inicio de sesión |
| app/(auth)/register/page.tsx | Formulario de registro de cliente |
| app/(app)/catalogo/page.tsx | Catálogo de productos con filtros |
| app/(app)/cotizacion/page.tsx | Carrito / resumen de cotización |
| app/(app)/cotizacion/\[id\]/page.tsx | Vista final de cotización generada |
| app/(app)/historial/page.tsx | Historial de cotizaciones del usuario |
| lib/supabase/client.ts | Cliente Supabase para el navegador |
| lib/supabase/server.ts | Cliente Supabase para Server Components |
| lib/whatsapp.ts | Generador de URL y mensaje de WhatsApp |
| components/ui/ | Componentes reutilizables (shadcn/ui) |
| components/cotizador/ | Componentes específicos del cotizador |
| store/cotizacion.ts | Estado global Zustand del carrito |

# **8\. Variables de Entorno**

Configurar en el archivo .env.local en desarrollo y en el dashboard de Vercel en producción:

| NEXT\_PUBLIC\_SUPABASE\_URL | URL del proyecto Supabase (público) |
| :---- | :---- |
| **NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY** | Clave anon de Supabase (público) |
| **SUPABASE\_SERVICE\_ROLE\_KEY** | Clave de servicio Supabase (privado, solo servidor) |
| **WHATSAPP\_NUMBER** | Número de WhatsApp de la empresa (formato: 573001234567\) |
| **NEXT\_PUBLIC\_EMPRESA\_NOMBRE** | Nombre de la empresa (aparece en cotizaciones) |
| **NEXT\_PUBLIC\_IVA\_PORCENTAJE** | Porcentaje de IVA a aplicar (ej: 19\) |
| **NEXT\_PUBLIC\_VIGENCIA\_DIAS** | Días de vigencia de la cotización (ej: 15\) |

# **9\. Plan de Desarrollo por Fases**

## **Fase 1 — MVP (4–6 semanas)**

* Configuración de proyecto Next.js 14 \+ Supabase.

* Diseño de base de datos y políticas RLS.

* Flujo completo de autenticación (registro, login, recuperación).

* Catálogo de productos con filtro por categoría.

* Cotizador interactivo con cálculo de totales.

* Vista final de cotización \+ botón de WhatsApp.

* Deploy en Vercel.

## **Fase 2 — Mejoras (2–3 semanas adicionales)**

* Exportación de cotización a PDF.

* Historial de cotizaciones por usuario.

* Panel de administración básico para gestión de productos y precios.

* Envío de cotización por email (Resend / Nodemailer).

## **Fase 3 — Optimización (continua)**

* Login con Google (OAuth Supabase).

* Notificaciones push / email al vendedor cuando llega un WhatsApp de cotización.

* Analytics de cotizaciones y productos más solicitados.

* Modo oscuro y mejoras de accesibilidad.

# **10\. Consideraciones Técnicas y de Seguridad**

## **Seguridad**

* Todas las rutas de la aplicación requieren sesión activa (middleware Next.js).

* RLS en Supabase impide acceso cross-user a nivel de base de datos.

* La SUPABASE\_SERVICE\_ROLE\_KEY nunca se expone al cliente.

* Validación de inputs con Zod tanto en cliente como en servidor.

## **Rendimiento**

* Imágenes de productos optimizadas con next/image.

* Catálogo cacheado con revalidación cada 1 hora (ISR de Next.js).

* Cálculo de totales 100% en cliente con Zustand (sin latencia de red).

## **Accesibilidad y UX**

* Componentes shadcn/ui cumplen WCAG 2.1 AA.

* Diseño responsive: mobile-first (la mayoría de usuarios accede desde móvil).

* Botón de WhatsApp siempre visible (sticky) en la vista de cotización.

| Nota importante | La plataforma NO procesa pagos. Toda transacción económica se cierra por WhatsApp con el equipo de ventas de la empresa. |
| :---- | :---- |

*Documento generado como especificación de requerimientos de software.*

Versión 1.0 — Mayo 2025 — Confidencial