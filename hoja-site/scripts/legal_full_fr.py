# -*- coding: utf-8 -*-
"""Traduction complete des longs paragraphes ES restants (affiliation + cookies)."""
from pathlib import Path

ROOT = Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")

# (espagnol COMPLET -> francais COMPLET)
T = [
 # clause 3 commissions
 ("Transcurrido el plazo de desistimiento, si el cliente decide voluntariamente cancelar su participación o no completa el pago dentro del plazo establecido, el importe abonado en concepto de reserva podrá ser retenido en compensación por la plaza reservada, siempre dentro de los límites permitidos por la legislación aplicable.",
  "Une fois le délai de rétractation écoulé, si le client décide volontairement d'annuler sa participation ou ne procède pas au paiement dans le délai établi, le montant versé à titre de réservation pourra être retenu en compensation de la place réservée, dans les limites autorisées par la législation applicable."),
 # clause 5
 ("El Afiliado podrá utilizar tanto enlaces gráficos como de texto en su sitio web, en correos electrónicos y en otros medios, tanto online como offline (anuncios clasificados, revistas, periódicos, etc.), siempre que dichos materiales se ajusten a las condiciones establecidas en este Acuerdo. Podrá utilizar el material gráfico y textual proporcionado por HOJA ACADEMY o crear el propio, siempre que éste sea adecuado, no induzca a error y respete las condiciones aquí dispuestas.",
  "L'Affilié pourra utiliser aussi bien des liens graphiques que textuels sur son site web, dans ses e-mails et autres supports, en ligne comme hors ligne (annonces classées, revues, journaux, etc.), pour autant que ces matériaux respectent les conditions établies dans le présent Accord. Il pourra utiliser le matériel graphique et textuel fourni par HOJA ACADEMY ou créer le sien, pourvu qu'il soit approprié, ne soit pas trompeur et respecte les conditions prévues ici."),
 ("El incumplimiento de cualquiera de estas obligaciones se considerará una infracción grave, habilitando a AI VENTURE S.L. para emprender las acciones legales pertinentes, incluyendo la solicitud de medidas cautelares, la reclamación de indemnizaciones por daños y perjuicios, y, en su caso, la denuncia penal conforme a lo establecido en la legislación vigente. AI VENTURE S.L. se reserva el derecho de vigilar y auditar el uso de la plataforma para prevenir y detectar actividades ilícitas o contrarias a lo estipulado en esta cláusula.",
  "Le non-respect de l'une de ces obligations sera considéré comme une infraction grave, autorisant AI VENTURE S.L. à engager les actions légales appropriées, notamment la demande de mesures conservatoires, la réclamation de dommages et intérêts et, le cas échéant, la plainte pénale conformément à la législation en vigueur. AI VENTURE S.L. se réserve le droit de surveiller et d'auditer l'utilisation de la plateforme afin de prévenir et détecter toute activité illicite ou contraire aux stipulations de la présente clause."),
 # clause 9 duree
 ("El presente Acuerdo entra en vigor a partir de la aceptación del Afiliado en el Programa y se mantendrá vigente hasta la terminación de su cuenta de afiliado. HOJA ACADEMY se reserva el derecho de modificar los términos y condiciones de este Acuerdo en cualquier momento; la continuación de la participación en el Programa tras dichas modificaciones implicará la aceptación de los mismos. En caso de no estar de acuerdo con los cambios, el Afiliado deberá dar por terminado su participación.",
  "Le présent Accord entre en vigueur à compter de l'acceptation de l'Affilié au Programme et restera en vigueur jusqu'à la clôture de son compte affilié. HOJA ACADEMY se réserve le droit de modifier les termes et conditions du présent Accord à tout moment ; la poursuite de la participation au Programme après de telles modifications vaudra acceptation de celles-ci. En cas de désaccord avec les modifications, l'Affilié devra mettre fin à sa participation."),
 # finalite donnees affiliation
 ("En caso de que solicites participar en el Programme Partenaires & Affiliation de HOJA ACADEMY, trataremos tus datos personales con la finalidad de gestionar tu solicitud, aprobar o rechazar tu participación, administrar tu cuenta de afiliado, realizar el seguimiento de las visitas y ventas atribuidas a tus enlaces o cupones, calcular las comisiones generadas, gestionar los pagos correspondientes y prevenir usos fraudulentos o contrarios a las condiciones del Programa.",
  "Si vous demandez à participer au Programme Partenaires & Affiliation de HOJA ACADEMY, nous traiterons vos données personnelles aux fins de gérer votre demande, d'approuver ou de refuser votre participation, d'administrer votre compte affilié, d'assurer le suivi des visites et des ventes attribuées à vos liens ou coupons, de calculer les commissions générées, de gérer les paiements correspondants et de prévenir les utilisations frauduleuses ou contraires aux conditions du Programme."),
 # cookies : explorer
 ("Puesto que las cookies son archivos de texto normales, se pueden explorar con la mayoría de editores de texto o programas de procesamiento de texto. Puede hacer clic en una cookie para abrirla. A continuación, se indica una lista de enlaces sobre cómo ver cookies en diferentes navegadores. Si utiliza otro navegador, consulte la información sobre cookies en el propio navegador. Si utiliza un teléfono móvil, consulte el manual del dispositivo para obtener más información.",
  "Les cookies étant de simples fichiers texte, vous pouvez les consulter avec la plupart des éditeurs de texte ou traitements de texte. Vous pouvez cliquer sur un cookie pour l'ouvrir. Vous trouverez ci-après une liste de liens expliquant comment consulter les cookies dans différents navigateurs. Si vous utilisez un autre navigateur, consultez les informations relatives aux cookies dans celui-ci. Si vous utilisez un téléphone mobile, consultez le manuel de l'appareil pour plus d'informations."),
 # cookies : desactiver
 ("Si no desea que los sitios web pongan ninguna cookie en su equipo, puede adaptar la configuración del navegador de modo que se le notifique antes de que se coloque ninguna cookie. De igual modo, puede adaptar la configuración de forma que el navegador rechace todas las cookies, o únicamente las cookies de terceros. También puede eliminar cualquiera de las cookies que ya se encuentren en el equipo. Tenga en cuenta que tendrá que adaptar por separado la configuración de cada navegador y equipo que utilice.",
  "Si vous ne souhaitez pas que des sites web déposent des cookies sur votre appareil, vous pouvez configurer votre navigateur pour être averti avant qu'un cookie soit déposé. De même, vous pouvez configurer le navigateur pour qu'il refuse tous les cookies, ou uniquement les cookies tiers. Vous pouvez également supprimer les cookies déjà présents sur votre appareil. Notez que vous devrez configurer séparément chaque navigateur et appareil que vous utilisez."),
 # titres clauses / labels
 ("Condiciones del Programme Partenaires & Affiliation", "Conditions du Programme Partenaires & Affiliation"),
 ("Puedes consultar todos los detalles en las", "Vous trouverez tous les détails dans les"),
 (" 3. Comisiones", " 3. Commissions"),
 (" 5. Enlaces de Afiliado y Material Publicitario", " 5. Liens d'affiliation et matériel publicitaire"),
 (" 6. Cupones y Sitios de Ofertas", " 6. Coupons et sites de bons plans"),
 ("Accede a tu panel de afiliado", "Accédez à votre espace affilié"),
 ("Subrayar enlaces", "Souligner les liens"),
 ("El Afiliado se compromete a:", "L'Affilié s'engage à :"),
 ("HOJA ACADEMY Cupones", "HOJA ACADEMY Coupons"),
 ("HOJA ACADEMY Descuentos", "HOJA ACADEMY Réductions"),
 # FAQ affiliation
 ("¿Durante cuánto tiempo se atribuye una venta a mi enlace?", "Pendant combien de temps une vente est-elle attribuée à mon lien ?"),
 ("¿Dónde puedo consultar mis comisiones?", "Où puis-je consulter mes commissions ?"),
 ("¿Dónde puedo consultar mis pagos anteriores?", "Où puis-je consulter mes paiements précédents ?"),
 ("¿Puedo comprar utilizando mi propio enlace de afiliado?", "Puis-je acheter en utilisant mon propre lien d'affiliation ?"),
 ("¿Qué hago si tengo una duda o detecto un problema con una comisión?", "Que faire en cas de doute ou de problème sur une commission ?"),
 ("¿Qué comisión recibo por cada venta?", "Quelle commission reçois-je pour chaque vente ?"),
 # accessibilite
 ("Pueden existir documentos en formato PDF publicados antes del 20 septembre 2018 que no cumplan en su totalidad todos los requisitos de accesibilidad.",
  "Des documents au format PDF publiés avant le 20 septembre 2018 peuvent ne pas satisfaire pleinement toutes les exigences d'accessibilité."),
 ("En algún caso puede producirse solapamiento de contenido", "Dans certains cas, un chevauchement de contenu peut survenir"),
 ("Existen documentos PDF con problemas de accesibilidad", "Des documents PDF présentent des problèmes d'accessibilité"),
 ("Hay contenido textual sin un contraste suficiente", "Du contenu textuel présente un contraste insuffisant"),
 ("informar sobre cualquier posible incumplimiento por parte de este sitio web.", "signaler toute éventuelle non-conformité de ce site web."),
 ("transmitir otras dificultades de acceso al contenido.", "transmettre d'autres difficultés d'accès au contenu."),
 ("Comunicaciones sobre requisitos de accesibilidad", "Communications relatives aux exigences d'accessibilité"),
 ("También puedes presentar una reclamación ante la autoridad de control en materia de protección de datos, en particular, ante la Agencia",
  "Vous pouvez également introduire une réclamation auprès de l'autorité de contrôle en matière de protection des données, notamment auprès de la Agencia"),
 # cookies analytiques
 ("Analítica de Google. Se usa para distinguir a los usuarios (expira en 2 años).",
  "Analytique Google. Utilisé pour distinguer les utilisateurs (expire dans 2 ans)."),
 ("Se usa para distinguir a los usuarios (expira en 24 horas).",
  "Utilisé pour distinguer les utilisateurs (expire dans 24 heures)."),
 ("Videollamada y compartir pantalla", "Visioconférence et partage d'écran"),
]

def apply(text):
    for es, fr in T:
        text = text.replace(es, fr)
    return text

changed = []
for p in sorted(ROOT.rglob("*.tsx")):
    raw = p.read_text(encoding="utf-8")
    new = apply(raw)
    if new != raw:
        p.write_text(new, encoding="utf-8", newline="\n")
        changed.append(str(p.relative_to(ROOT)))
print(f"{len(changed)} fichiers modifies")
for c in changed: print("  " + c)
