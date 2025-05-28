<!-- <script src="/js/calendrier/calendrier.js"></script> -->
<!-- <script src="/jquery/ux/calendrier/api.js"></script>

<?php
if (NR_Utilitaires::verificationAbonnementModule('calendar_sync')) :
?>
    <div id="gestion_sources">
        <h2>Gérer les calendriers</h2>
        <div class="corpspopup">
            <?php foreach ($this->sources as $source) : ?>
                <span data_sourceId="<?= $source['source'] ?>">
                    <input type="text" name="titre" value="<?= $source['titre'] ?>" placeholder="Nom du calendrier" required />
                    <span class="rz-infobulle-declencheur source_url">&#9432;
                        <div class="rz-infobulle-texte">
                            <?= $source['url'] ?>
                        </div>
                    </span>
                    <input class="rz-bouton" type="color" name="couleur" value="<?= $source['couleur'] ?>" />
                    <input class="rz-bouton" type="button" value="Modifier" onclick="modsrcevent(this)" />
                    <input class="rz-bouton" type="button" value="Supprimer" onclick="delsrcevent(this)" />
                </span>
            <?php endforeach; ?>

            <fieldset id="newsrc">
                <legend>Ajouter un calendrier</legend>
                <input type="url" name="url" class="inputtableur" placeholder="URL du calendrier" required />
                <input type="text" name="titre" class="inputtableur" placeholder="Nom du calendrier" required />
                <input class="rz-bouton" type="color" name="couleur" value="#ff8000" />
                <input class="rz-bouton" type="button" value="Ajouter" onclick="addsrcevent()" />
            </fieldset>
        </div>
    </div>
    <div id="lienprive" class="cal-popup-publier">
                    <div class="cal-popup-inner">
                        <div class="cal-popup-inner-content">
                            <h1>Partager le calendrier <?= NR_Utilitaires::getTitreApplication(true) ?></h1>
                            <script>
                                function toClipboard() {
                                    if (!navigator.clipboard) return;
                                    const lien = document.querySelector('[name="lienprive"]')
                                    navigator.clipboard.writeText(lien.value).then(() => {
                                        alert("Lien copié dans le presse-papier")
                                    })
                                }
                            </script>
                            <input type="text" readonly name="lienprive" value="<?= $this->lienprive ?>" />
                            <input class="rz-bouton" type="button" value="Copier dans le presse-papier" onclick="toClipboard()" />
                            <input class="rz-bouton" type="button" value="Reinitialiser le lien" onclick="reinitlink()" />
                        </div>
                        <span class="cal-popup-close fermerpopup">X</span>
                    </div>
                </div>

<?php endif; ?> -->




<!-- <script src="/js/calendrier/calendrier.js"></script> -->
<script src="/jquery/ux/calendrier/api.js"></script>

<?php
if (NR_Utilitaires::verificationAbonnementModule('calendar_sync')) :
?>
<div id="gestion_sources">
    <div class="cal-menu-content p-2">
        <h2>Gérer les calendriers</h2>
        <div class="corpspopup">

            <?php foreach ($this->sources as $source) : ?>
            <div data_sourceId="<?= $source['source'] ?>" class="mb-3">
                <div class="row g-3">
                    <div class="col-md-6">
                        <input type="text" name="titre" class="form-control form-control-sm"
                            value="<?= $source['titre'] ?>" placeholder="Nom du calendrier" required />
                    </div>
                    <div class="col-md-6">
                        <input class="form-control form-control-color" type="color" name="couleur"
                            value="<?= $source['couleur'] ?>" />
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <span class="rz-infobulle-declencheur source_url">&#9432;
                        <div class="rz-infobulle-texte">
                            <?= $source['url'] ?>
                        </div>
                    </span>
                    <div>
                        <input class="btn btn-sm btn-primary" type="button" value="Modifier"
                            onclick="modsrcevent(this)" />
                        <input class="btn btn-sm btn-danger" type="button" value="Supprimer"
                            onclick="delsrcevent(this)" />
                    </div>
                </div>
            </div>
            <?php endforeach; ?>

            <fieldset id="newsrc" class="mt-3">
                <legend>Ajouter un calendrier</legend>
                <div class="row g-3">
                    <div class="col-md-6">
                        <input type="url" name="url" class="form-control form-control-sm"
                            placeholder="URL du calendrier" required />
                    </div>
                    <div class="col-md-6">
                        <input type="text" name="titre" class="form-control form-control-sm"
                            placeholder="Nom du calendrier" required />
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <input class="form-control form-control-color" type="color" name="couleur" value="#ff8000" />
                    <input class="btn btn-sm btn-success" type="button" value="Ajouter" onclick="addsrcevent()" />
                </div>
            </fieldset>
        </div>
    </div>

    <!-- Popup pour partager le lien du calendrier -->
    <div id="lienprive" class="cal-popup-publier">
        <div class="cal-popup-inner">
            <div class="cal-popup-inner-content">
                <h1>Partager le calendrier <?= NR_Utilitaires::getTitreApplication(true) ?></h1>
                <script>
                function toClipboard() {
                    if (!navigator.clipboard) return;
                    const lien = document.querySelector('[name="lienprive"]')
                    navigator.clipboard.writeText(lien.value).then(() => {
                        alert("Lien copié dans le presse-papier")
                    })
                }
                </script>
                <input type="text" readonly name="lienprive" value="<?= $this->lienprive ?>" />
                <input class="rz-bouton" type="button" value="Copier dans le presse-papier" onclick="toClipboard()" />
                <input class="rz-bouton" type="button" value="Reinitialiser le lien" onclick="reinitlink()" />
            </div>
            <span class="cal-popup-close fermerpopup">X</span>
        </div>
    </div>
    <?php endif; ?>