# -*- coding: utf-8 -*-
"""Passe FR des fragments ES restants des pages legales + affiliados (remplacements cibles)."""
import re
from pathlib import Path

ROOT = Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")

# fragments ES -> FR (remplacement litteral ; appliques du plus long au plus court)
T = [
 # ---- accessibilite ----
 ("Pueden existir documentos en formato PDF publicados antes del 20 septembre 2018 que no cumplan en su totalidad todos los requisitos de accesibilidad.",
  "Des documents au format PDF publiés avant le 20 septembre 2018 peuvent ne pas satisfaire entièrement toutes les exigences d'accessibilité."),
 ("En algún caso puede producirse solapamiento de contenido", "Dans certains cas, un chevauchement de contenu peut survenir"),
 ("Existen documentos PDF con problemas de accesibilidad", "Des documents PDF présentent des problèmes d'accessibilité"),
 ("Hay contenido textual sin un contraste suficiente", "Du contenu textuel présente un contraste insuffisant"),
 ("Les communications seront reçues et traitées par l'Unité Responsable de l'Accessibilité de la Subdirección General de Promoción y Autorizaciones.",
  "Les communications seront reçues et traitées par l'Unité Responsable de l'Accessibilité de la Subdirección General de Promoción y Autorizaciones."),
 ("Avisos", "Avis"),
 ("informar sobre cualquier posible incumplimiento por parte de este sitio web.",
  "signaler toute éventuelle non-conformité de ce site web."),
 ("transmitir otras dificultades de acceso al contenido.",
  "transmettre d'autres difficultés d'accès au contenu."),
 ("También puedes presentar una reclamación ante la autoridad de control en materia de protección de datos, en particular, ante la Agencia Espagnole de Protección ",
  "Vous pouvez également introduire une réclamation auprès de l'autorité de contrôle en matière de protection des données, notamment auprès de la Agencia Española de Protección "),

 # ---- cookies ----
 ("Analítica de Google. Se usa para distinguir a los usuarios (expira en 2 años).",
  "Analytique Google. Utilisé pour distinguer les utilisateurs (expire dans 2 ans)."),
 ("Se usa para distinguir a los usuarios (expira en 24 horas).",
  "Utilisé pour distinguer les utilisateurs (expire dans 24 heures)."),
 ("Puesto que las cookies son archivos de texto normales, se pueden explorar con la mayoría de editores de texto o programas de procesamiento de texto. Puede hacer",
  "Les cookies étant de simples fichiers texte, vous pouvez les consulter avec la plupart des éditeurs de texte ou traitements de texte. Vous pouvez"),
 ("Si no desea que los sitios web pongan ninguna cookie en su equipo, puede adaptar la configuración del navegador de modo que se le notifique antes de que se colo",
  "Si vous ne souhaitez pas que des sites web déposent des cookies sur votre appareil, vous pouvez configurer votre navigateur pour être averti avant qu'ils soient"),

 # ---- conditions / programme affiliados (fragment pur, sans squelette JSX) ----
 ("Condiciones del Programme Partenaires & Affiliation", "Conditions du Programme Partenaires & Affiliation"),
 ("Puedes consultar todos los detalles en las", "Vous trouverez tous les détails dans les"),
 ("Transcurrido el plazo de desistimiento, si el cliente decide voluntariamente cancelar su participación o no completa el pago dentro del plazo establecido, el im",
  "Une fois le délai de rétractation écoulé, si le client décide volontairement d'annuler sa participation ou ne complète pas le paiement dans le délai établi, le mo"),
 (" 3. Comisiones ", " 3. Commissions "),
 (" 5. Enlaces de Afiliado y Material Publicitario ", " 5. Liens d'affiliation et matériel publicitaire "),
 (" 6. Cupones y Sitios de Ofertas ", " 6. Coupons et sites de bons plans "),
 ("Accede a tu panel de afiliado", "Accédez à votre espace affilié"),
 ("Subrayar enlaces", "Souligner les liens"),
 ("El Afiliado se compromete a:", "L'Affilié s'engage à :"),
 ("El Afiliado podrá utilizar tanto enlaces gráficos como de texto en su sitio web, en correos electrónicos y en otros medios, tanto online como offline (anuncios",
  "L'Affilié pourra utiliser aussi bien des liens graphiques que textuels sur son site web, dans ses e-mails et autres supports, en ligne comme hors ligne (annonces"),
 ("El incumplimiento de cualquiera de estas obligaciones se considerará una infracción grave, habilitando a AI VENTURE S.L. para emprender las acciones legales per",
  "Le non-respect de l'une de ces obligations sera considéré comme une infraction grave, autorisant AI VENTURE S.L. à engager les actions légales prévues"),
 ("El presente Acuerdo entra en vigor a partir de la aceptación del Afiliado en el Programa y se mantendrá vigente hasta la terminación de",
  "Le présent Accord entre en vigueur à compter de l'acceptation de l'Affilié au Programme et restera valable jusqu'à la résiliation de"),
 ("En caso de que solicites participar en el Programme Partenaires & Affiliation de HOJA ACADEMY, trataremos tus datos personales con la finalidad de gestionar tu",
  "Si vous demandez à participer au Programme Partenaires & Affiliation de HOJA ACADEMY, nous traiterons vos données personnelles aux fins de gérer votre"),
 ("•S'abstenir d'enchérir sur des termes liés à « HOJA ACADEMY Cupones », « HOJA ACADEMY Descuentos » ou à d'autres expressions pouvant induire l'utilisateur en er",
  "•S'abstenir d'enchérir sur des termes liés à « HOJA ACADEMY Coupons », « HOJA ACADEMY Réductions » ou à d'autres expressions pouvant induire l'utilisateur en er"),

 # ---- FAQ affiliation (questions) ----
 ("¿Durante cuánto tiempo se atribuye una venta a mi enlace?", "Pendant combien de temps une vente est-elle attribuée à mon lien ?"),
 ("¿Dónde puedo consultar mis comisiones?", "Où puis-je consulter mes commissions ?"),
 ("¿Dónde puedo consultar mis pagos anteriores?", "Où puis-je consulter mes paiements précédents ?"),
 ("¿Puedo comprar utilizando mi propio enlace de afiliado?", "Puis-je acheter en utilisant mon propre lien d'affiliation ?"),
 ("¿Qué hago si tengo una duda o detecto un problema con una comisión?", "Que faire en cas de doute ou de problème détecté sur une commission ?"),
 ("¿Qué comisión recibo por cada venta?", "Quelle commission reçois-je pour chaque vente ?"),

 # ---- tutor equipe (fragment restant curso-ia) ----
 ("Alejavi Rivera es un referente en la divulgación y enseñanza de la inteligencia artificial. En los últimos tres años, ha publicado contenido práctico en YouTube",
  "Alejavi Rivera est une référence en vulgarisation et enseignement de l'intelligence artificielle. Ces trois dernières années, il a publié du contenu pratique sur YouTube"),
 ("9.2 Videollamada y compartir pantalla", "9.2 Visioconférence et partage d'écran"),
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
