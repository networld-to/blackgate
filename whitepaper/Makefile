all:
	pdflatex distributed_hosting_whitepaper.tex && \
	makeindex distributed_hosting_whitepaper.idx -s StyleInd.ist && \
	biber distributed_hosting_whitepaper
	for number in 1 2; do \
		pdflatex distributed_hosting_whitepaper.tex; \
	done


clean:
	-rm -f *.aux *.log *.idx *.bcf *.fdb_latexmk *.fls *.toc *.blg *.synctex.gz *.bbl *.log *.run.xml *.ind *.ilg

