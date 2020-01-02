$(document).ready(function () {
    // variable declaration
    let counter = 0;
    let ects = 0;
    let sati = 0;
    let sviKolegiji = [];

    // ==================================== get table data on page load =============================================

    // fill up datalist
    $.get("http://www.fulek.com/VUA/SUPIT/GetNastavniPlan", function (kolegijiArray) {
        kolegijiArray.forEach(kolegij => {
            $('#sviKolegiji').append("<option value='" + kolegij.label + "'>");
        });
    });

    // get all data about each kolegij
    for (let i = 1; i <= 40; i++) {
        $.get(`http://www.fulek.com/VUA/supit/GetKolegij/${i}`, function (kolegij) {
            sviKolegiji.push(kolegij)
        });
    }

    // ==================================== on datalist selection =============================================

    $(document).on('input', '#nazivKolegija', function () {
        // getting data for entered kolegij
        const kolegij = $("#nazivKolegija").val();
        kolegijData = sviKolegiji.filter(element => element.kolegij == kolegij);

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

        $(".table tbody").append(`
        <tr>
            <td>${kolegijData[0].kolegij}</td>
            <td>${kolegijData[0].ects}</td>
            <td>${kolegijData[0].sati}</td>
            <td>${kolegijData[0].predavanja}</td>
            <td>${kolegijData[0].vjezbe}</td>
            <td>${kolegijData[0].tip}</td>
            <td class="border-0"><input class="btn btn-danger btn-sm" type="submit" value="Obriši"></td>
        </tr>
        `);

        $(".table tfoot").html(`
        <tr>
            <th>Ukupno</th>
            <td>${ects += kolegijData[0].ects}</td>
            <td>${sati += kolegijData[0].sati}</td>
        </tr>
        `);

        ++counter;
        $("#nazivKolegija").val('');
    });

    // ==================================== on delete button click =============================================

    $("body").on("click", ".btn-danger", function () {
        deletedRow = $(this).parents("tr").remove().text().split("\n");

        $(".table tfoot").html(`
        <tr>
            <th>Ukupno</th>
            <td>${ects -= deletedRow[2]}</td>
            <td>${sati -= deletedRow[3]}</td>
        </tr>
        `);

        --counter;

        // remove table header and footer if there are no table data
        if (counter == 0) {
            $("table > thead tr").remove();
            $("table > tfoot tr").remove();
        }
    });
}); 