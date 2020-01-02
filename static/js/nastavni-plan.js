$(document).ready(function () {
    let counter = 0;
    let ects = 0;
    let sati = 0;
    let sviKolegiji = [];

    // =============================== fill up datalist on page load ========================================

    // fill up datalist and array
    $.get("http://www.fulek.com/VUA/SUPIT/GetNastavniPlan", function (result) {
        result.forEach(kolegij => {
            $('#sviKolegiji').append("<option value='" + kolegij.label + "'>");
        });
        sviKolegiji = result;
    });

    // ============================ on one datalist option selection ========================================

    $(document).on('change', '#nazivKolegija', function () {
        // read entered kolegij from input field
        kolegij = $("#nazivKolegija").val();
        requestedKolegij = sviKolegiji.filter(data => data.label == kolegij);

        try {
            // GET request
            $.get(`http://www.fulek.com/VUA/supit/GetKolegij/${requestedKolegij[0].value}`, function (kolegijData, status) {
                if (status != "success") {
                    console.log(status);
                    alert("Došlo je do pogreške. Molim probajte još jednom.");
                }

                // add table row
                $(".table tbody").append(`
                <tr>
                    <td>${kolegijData.kolegij}</td>
                    <td>${kolegijData.ects}</td>
                    <td>${kolegijData.sati}</td>
                    <td>${kolegijData.predavanja}</td>
                    <td>${kolegijData.vjezbe}</td>
                    <td>${kolegijData.tip}</td>
                    <td><input class="btn btn-danger btn-sm" type="submit" value="Obriši"></td>
                </tr>
                `);

                // update table footer values
                $(".table tfoot").html(`
                <tr>
                    <th>Ukupno</th>
                    <td>${ects += kolegijData.ects}</td>
                    <td>${sati += kolegijData.sati}</td>
                </tr>
                `);
            });

            // add header and footer if there are no previous table data
            if (counter == 0) {
                $(".table thead").append(`
                    <tr>
                        <th scope="col">Kolegij</th>
                        <th scope="col">ECTS</th>
                        <th scope="col">Sati</th>
                        <th scope="col">P</th>
                        <th scope="col">V</th>
                        <th scope="col">Tip</th>
                        <th scope="col"></th>
                    </tr>
                    `);
            }

        } catch (e) {
            console.log(e);
            alert("Obrišite sve iz input polja i probajte još jednom.");
        }

        finally {
            ++counter;
            $("#nazivKolegija").val('');
        }
    });

    // ==================================== on delete button click ============================================

    $("body").on("click", ".btn-danger", function () {
        --counter;

        // delete row, get values of deleted row and update table footer values
        deletedRow = $(this).parents("tr").remove().text().split("\n");
        $(".table tfoot").html(`
        <tr>
            <th>Ukupno</th>
            <td>${ects -= deletedRow[2]}</td>
            <td>${sati -= deletedRow[3]}</td>
        </tr>
        `);

        // remove table header and footer if there are no table data
        if (counter == 0) {
            $("table > thead tr").remove();
            $("table > tfoot tr").remove();
        }
    });
}); 