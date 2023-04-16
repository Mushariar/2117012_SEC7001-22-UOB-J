APPNAME=DISSERTATION
BASE=/Users/macbookpro/hdd/MSc/Dissertation/data/getdata
LOG=${BASE}/log
DATA=datafile
LOGFILE=${LOG}/${APPNAME}.process.log
LOCKFILE=${BASE}/pid.lock
GZFILES=${BASE}/rawdata

DOWNLOAD=${BASE}/rawdata_download

cd ${BASE}

RETCODE=$?

if [ ${RETCODE} != "0" ]
then
	echo "[`date`] Base folder is missing, cannot start script"
	exit 1
fi

mkdir ${DATA} ${LOG} >/dev/null 2>&1


for p in {1..15}
do 
  {
    for j in {0..23}
    do
    {
      
      printf -v k "%02d" $p

      i=2023-03-${k}
      
      f=${DOWNLOAD}/$i-$j.json.gz 
      filename=$i-$j.json.gz 
      
      echo "Downloading: $filename"

      #getfilemanual.js
      time npm stop ${filename} 

      if gzip -t ${f};
      then :
        echo "$(basename "$f") is ok" 
        #>> ${LOGFILE}

        #index.js
        #time npm start ${f} 
        #rm -f ${f}
        #mv $f ${DONE}/
      else
        echo "$(basename "$f") is corrupt" 
        #>> ${LOGFILE}
        
        echo "$(basename "$f") re-downloading" 
        #>> ${LOGFILE}
        rm -f ${f}
        time npm stop ${filename} 
        #time npm start ${f} 
        #rm -f ${f}
      fi
    }
    done
  }
done


