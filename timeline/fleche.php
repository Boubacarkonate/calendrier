<?php

class NR_Uxtdbk_Fleche extends Zend_Db_Table_Abstract
{
    private array $groupes;
    private array $fiches;
    private int $K;

    public function __construct($K)
    {
        parent::__construct();
        $this->K = $K;
    }

    public function getGroupes()
    {
        $sql = 'SELECT * FROM aux_typefiche_ligne_fleche ORDER BY ordre';
        $res = $this->_db->fetchAll($sql);
        $datas = [];

        foreach ($res as $ligne) {
            $json = json_decode($ligne['typefiches_json'], true);
            foreach ($json as $value) {
                $datas[$ligne['ordre']][] = [
                    "typeK" => $ligne['typeK'],
                    "typefiche" => $value
                ];
            }
        }

        $this->groupes = $datas;
            echo "<p>GROUPES</p><pre>";
    print_r($datas);
    echo "</pre><hr><br>";
        return $datas;
    }

public function getFiches()
{
    $sql = "
        SELECT  
            fiche_valides.N, 
            fiche_valides.typefiche,
            fiche_valides.typeK,
            fiche_valides.nom_affiche,
            titre_action.vl AS titre_action,
            date_action.vl AS date_action
        FROM tbk AS base_table
        INNER JOIN (
            SELECT  
                meta.K, 
                meta.N, 
                meta.typefiche, 
                type_fiche_info.typeK, 
                type_fiche_info.nom_affiche
            FROM tbmeta AS meta
            INNER JOIN aux_typefiche AS type_fiche_info 
                ON meta.typefiche = type_fiche_info.typefiche
            WHERE 
                type_fiche_info.categorie = 'NRaction'
                AND type_fiche_info.typefiche NOT LIKE 'ARCHIV\_%'
                AND type_fiche_info.typefiche NOT LIKE 'SUPPR\_%'
                AND type_fiche_info.typefiche <> 'NRaccueiladmin'
        ) AS fiche_valides
            ON fiche_valides.K = base_table.K 
            AND fiche_valides.typeK = base_table.typeK
        INNER JOIN (
            SELECT N, vl 
            FROM tbkvc100 
            WHERE actif = 1 AND vr = 'NRtitreaction'
        ) AS titre_action
            ON titre_action.N = fiche_valides.N
        INNER JOIN (
            SELECT N, vl 
            FROM tbkdate 
            WHERE actif = 1 AND vr = 'NRdateaction'
        ) AS date_action
            ON date_action.N = fiche_valides.N
        WHERE base_table.K = ?
    ";

    $result = $this->_db->fetchAll($sql, [$this->K]);

    foreach ($result as &$ligne) {
        $ligne["couleur"] = $this->getCouleurTypefiches($ligne["typefiche"], $ligne["N"]);
    }

    $this->fiches = $result;
             echo "<p>FICHE</p><pre>";
        print_r($result);
        echo "</pre><hr><br>";
    return $result;
}

       

public function actionCollective() {
    $sql = "
        SELECT  
            m.N AS N,
            NRtitreaction.vl AS NRtitreaction,
            t.typeK AS typeK,
            'NRaccueiladmin' AS typefiche,
            m.nom_affiche AS typefiche_nomaffiche,
            NRdateaction.vl AS NRdateaction,
            'actioncollective' AS dansdomaine
        FROM (
            SELECT K, typeK 
            FROM tbk 
            WHERE typeK LIKE 'NRTYPEKac%' 
                AND typeK NOT LIKE 'NRTYPEKac%\\_ARCHIV' 
                AND typeK NOT LIKE 'NRTYPEKac%\\_SUPPR'
        ) t
        INNER JOIN (
            SELECT N, K 
            FROM tbkliaison 
            WHERE actif = 1 AND vl = ?
            UNION
            SELECT N, CAST(vl AS UNSIGNED) AS K 
            FROM tbkliaison 
            WHERE actif = 1 AND K = ?
        ) l ON l.K = t.K
        INNER JOIN (
            SELECT a.K, a.N, a.typefiche, b.nom_affiche, b.typeK
            FROM tbmeta a
            INNER JOIN aux_typefiche b 
                ON a.typefiche = b.typefiche
            WHERE a.typefiche = 'NRaccueiladmin'
                AND b.categorie = 'NRaction'
        ) m ON m.K = t.K AND m.typeK = t.typeK
        INNER JOIN (
            SELECT N, vl 
            FROM tbkvc100 
            WHERE actif = 1 AND vr = 'NRtitreaction'
        ) NRtitreaction ON NRtitreaction.N = m.N
        INNER JOIN (
            SELECT N, vl 
            FROM tbkdate 
            WHERE actif = 1 AND vr = 'NRdateaction'
        ) NRdateaction ON NRdateaction.N = m.N
    ";

    $result = $this->_db->fetchAll($sql, [$this->K, $this->K]);
    $this->fiches = $result;
    return $result;
}

public function getActionCollectiveAvecDuree()
{
    $actions = $this->actionCollective();
    //     echo "<p>ACTION COLLECTIVE</p><pre>";
    // print_r($actions);
    // echo "</pre><hr><br>";
    return $this->duree($actions); 
}


    public function duree($data)
    {
        $sql = "SELECT * FROM aux_vrs_dates_fleche GROUP BY typek, typefiche";
        $date_debut_fin = $this->_db->fetchAll($sql);

        $resultats = [];

  foreach ($data as $ligne) {
    $search = ["typeK" => $ligne['typeK'], "typefiche" => $ligne['typefiche']];
    $typeficheAvecDuree = $this->array_search_multi($date_debut_fin, $search);

    if (!empty($typeficheAvecDuree)) {
        $n = (int) $ligne['N'];
        $vrDebut = $typeficheAvecDuree['vr_debut'];
        $vrFin = $typeficheAvecDuree['vr_fin'];

        $ligne["typefiche_date_debut"] = $this->_db->fetchOne(
            "SELECT vl FROM tbkdate WHERE actif = 1 AND vr = ? AND N = ?",
            [$vrDebut, $n]
        );
        $ligne["typefiche_date_debutFR"] = $this->dateEnFR($ligne["typefiche_date_debut"]);

        $ligne["typefiche_date_fin"] = $this->_db->fetchOne(
            "SELECT vl FROM tbkdate WHERE actif = 1 AND vr = ? AND N = ?",
            [$vrFin, $n]
        );
        $ligne["typefiche_date_finFR"] = $this->dateEnFR($ligne["typefiche_date_fin"]);

        $ligne["affichagecoupdoeil"] = $typeficheAvecDuree["affichagecoupdoeil"];
    }

    // Ajouter la couleur dans tous les cas
    // $ligne["couleur"] = $this->getCouleurTypefiches($ligne["typefiche"], $ligne["N"]);

    $resultats[] = $ligne;
}

            echo "<p>DUREE</p><pre>";
    print_r($resultats);
    echo "</pre><hr><br>";

        return $resultats;
    }

    public function getFichesAvecDuree()
    {
        $fiches = $this->getFiches();
        return $this->duree($fiches);
    }

    public function dateEnFR($dateEN)
    {
        if (!$dateEN) return null;
        $date = new DateTime($dateEN);
        return $date->format('d/m/Y');
    }

    public function dateEnEntier($dateEN)
    {
        if (!$dateEN) return null;
        $date = new DateTime($dateEN);
        return $date->format('Ymd');
    }

    public function array_search_multi($arr, $search)
    {
        foreach ($arr as $v) {
            if (array_intersect_assoc($v, $search) === $search) {
                return $v;
            }
        }
        return [];
    }

        public function get_aux_uxcouleurs_typefiche($type, $N){
        $qtype = $this->_db->quote($type);
	    $sql = "
            select
                atfc.$type, COALESCE(auc.couleur, '#FF4C61') as couleur
            from aux_typefiche_composition atfc
            join aux_uxcouleursicones auc
                on auc.type = $qtype
                and auc.nom = atfc.$type
                and auc.actif
            group by atfc.$type
            Union 
            select  t0.typeK , COALESCE(auc.couleur, '#FF4C61') as couleur
            from tbmeta m
            join tbk t0 on t0.K = m.K
            join aux_uxcouleursicones auc
                on auc.type = $qtype
                and auc.nom = t0.typeK
                and auc.actif
            where m.N = $N  
            group by t0.typeK
        ";
	    $resultats = $this->_db->fetchAll($sql);
    //  echo "<p>COULEUR1</p><pre>";
    // print_r($resultats);
    // echo "</pre><hr><br>";

	    return $resultats;
    }
    public function getCouleurTypefiches($typefiche, $N){
        $res    = $this->get_aux_uxcouleurs_typefiche("typefiche", $N);
        $couleur = '#808080';  // valeur par défaut
        $findTypefiche = $this->array_search_multi($res, array('typefiche' => $typefiche));
        if (count($findTypefiche) > 0 )
            $couleur = $findTypefiche['couleur'];
    //  echo "<p>COULEUR2</p><pre>";
    // print_r($couleur);
    // echo "</pre><hr><br>";
    echo "<p>Couleur pour $typefiche (N: $N): $couleur</p>";  

        return $couleur;
    }

}