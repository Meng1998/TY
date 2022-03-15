// RecordPlay.cpp : ʵ���ļ�
//

#include "stdafx.h"
#include "Demo.h"
#include "RecordPlayDialog.h"
#include "afxdialogex.h"
// CRecordPlay �Ի���

IMPLEMENT_DYNAMIC(CRecordPlayDialog, CDialog)

CRecordPlayDialog::CRecordPlayDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_PLAYBACK, pParent)
	, _url(_T(""))
	, _snapPicFile(_T(""))
	, _volume(0)
	, _osdX(0)
	, _osdY(0)
	, _osdFontSize(0)
	, _osdR(0)
	, _osdG(0)
	, _osdB(0)
	, _osdAlignType(0)
	, _osdText(_T(""))
	, _localRecordType(0)
	, _localRecordFile(_T(""))
	, _streamInfo(_T(""))
	, _yuvInfo(_T(""))
	, _isFontBold(0)
	, _curPlayTimeStamp(0)
	, _timeStampToSeek(0)
	, _volumeToSet(0)
	, _speed(0)
	, _packageSize(1024 * 1024 * 500)
	, _privateMainType(0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020)
	, _privateSubType(0)
{

}

CRecordPlayDialog::~CRecordPlayDialog()
{
}

void CRecordPlayDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT_RECORD_URL, _url);
	DDX_Text(pDX, IDC_EDIT_RECORD_SNAL_FILE, _snapPicFile);
	DDX_Text(pDX, IDC_EDIT_RECORD_VOLUME, _volume);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_X, _osdX);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_Y, _osdY);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_FONTSIZE, _osdFontSize);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_R, _osdR);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_G, _osdG);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_B, _osdB);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_ALIGN, _osdAlignType);
	DDX_Control(pDX, IDC_COMBO_RECORD_OSD_ID, _osdCombBox);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_TEXT, _osdText);
	DDX_Text(pDX, IDC_EDIT_RECORD_LOCALRECORD_TYPE, _localRecordType);
	DDX_Text(pDX, IDC_EDIT_RECORD_LOCAL_FILE, _localRecordFile);
	DDX_Control(pDX, IDC_LIST_PLAYBACK_MSGBOX, _msgBox);
	DDX_Control(pDX, IDC_STATIC_PLAYBACK_PLAYWND, _recordPlayWnd);
	DDX_Text(pDX, IDC_EDIT_RECORD_STREAM, _streamInfo);
	DDX_Text(pDX, IDC_EDIT_RECORD_YUV, _yuvInfo);
	DDX_Control(pDX, IDC_DATETIMEPICKER_RECORD_STARTDATE, _startDate);
	DDX_Control(pDX, IDC_DATETIMEPICKER_RECORD_STARTTIME, _startTime);
	DDX_Control(pDX, IDC_DATETIMEPICKER_RECORD_ENDDATE, _endDate);
	DDX_Control(pDX, IDC_DATETIMEPICKER_RECORD_ENDTIME, _endTime);
	DDX_Text(pDX, IDC_EDIT_RECORD_OSD_BOLD, _isFontBold);
	DDX_Text(pDX, IDC_EDIT_RECORD_CUR_PLAYTIMESTAMP, _curPlayTimeStamp);
	DDX_Text(pDX, IDC_EDIT_RECORD_TIMESTAP_TOSEEK, _timeStampToSeek);
	DDX_Text(pDX, IDC_EDIT_RECORD_VOLUME_TOSET, _volumeToSet);
	DDX_Text(pDX, IDC_EDIT_RECORD_PARAM, _speed);
	DDX_Text(pDX, IDC_EDIT_RECORD_PACKAGESIZE, _packageSize);
	DDX_Text(pDX, IDC_EDIT_RECORD_MAINTYPE, _privateMainType);
	DDX_Text(pDX, IDC_EDIT_RECORD_SUBTYPE, _privateSubType);
}

BOOL CRecordPlayDialog::PreTranslateMessage(MSG * pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}


BEGIN_MESSAGE_MAP(CRecordPlayDialog, CDialog)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_START, &CRecordPlayDialog::OnBnClickedButtonRecordStart)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_STOP, &CRecordPlayDialog::OnBnClickedButtonRecordStop)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SNAP, &CRecordPlayDialog::OnBnClickedButtonRecordSnap)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_OPENSOUND, &CRecordPlayDialog::OnBnClickedButtonRecordOpensound)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_CLOSESOUND, &CRecordPlayDialog::OnBnClickedButtonRecordClosesound)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_VIDEO_DETAIL, &CRecordPlayDialog::OnBnClickedButtonRecordVideoDetail)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_GETVOLUME, &CRecordPlayDialog::OnBnClickedButtonRecordGetvolume)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SETVOLUME, &CRecordPlayDialog::OnBnClickedButtonRecordSetvolume)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SETOSD, &CRecordPlayDialog::OnBnClickedButtonRecordSetosd)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_START_LOCALRECORD, &CRecordPlayDialog::OnBnClickedButtonRecordStartLocalrecord)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_STOP_LOCALRECORD, &CRecordPlayDialog::OnBnClickedButtonRecordStopLocalrecord)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_PAUSE, &CRecordPlayDialog::OnBnClickedButtonRecordPause)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_RESUME, &CRecordPlayDialog::OnBnClickedButtonRecordResume)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_GETTIMESTAMP, &CRecordPlayDialog::OnBnClickedButtonRecordGettimestamp)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SEEK, &CRecordPlayDialog::OnBnClickedButtonRecordSeek)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_SPEED, &CRecordPlayDialog::OnBnClickedButtonRecordSpeed)
	ON_LBN_DBLCLK(IDC_LIST_PLAYBACK_MSGBOX, &CRecordPlayDialog::OnLbnDblclkListPlaybackMsgbox)
	ON_MESSAGE(MSG_UPDATE_CALLBACKINFO, &CRecordPlayDialog::OnUpdateCallbackInfo)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_PRIVATE_OPEN, &CRecordPlayDialog::OnBnClickedButtonRecordPrivateOpen)
	ON_BN_CLICKED(IDC_BUTTON_RECORD_PRIVATE_CLOSE, &CRecordPlayDialog::OnBnClickedButtonRecordPrivateClose)
END_MESSAGE_MAP()

void CRecordPlayDialog::NotifyDialogInited(const char* exeFolder)
{
	_exefold = nullptr == exeFolder ? "" : exeFolder;
	EnableToolTips(TRUE);
	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
	_toolTip.Activate(TRUE);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_GPU), L"�Ƿ�����GPUӲ�⣬��ѡ���ã��������ã�ע�⿪��Ӳ����޷��ص�YUV���ݣ�Ӳ���²�����ʹ��ץͼ����");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISUSEHWND), L"�Ƿ���ʾ���棬��ѡ��ʾ��������ʾ");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISUSEYUV), L"�Ƿ�ص�YUV���ݣ���ѡ�ص������򲻻ص���ע�⿪��Ӳ����޷��ص�YUV����");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISUSESTREAM), L"�Ƿ�ص��������ݣ���ѡ�ص������򲻻ص�");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISUSEMSG), L"�Ƿ�ص���Ϣ����ѡ�ص������򲻻ص�");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISASYN), L"�Ƿ������첽ģʽ�����ú�ʹ���첽�طŽӿڻط�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_URL), L"������ط�URL");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_START), L"����ͬ�����첽�طţ�Video_StartPlayback/Video_StartAsynPlayback��ȡ����ȡYUV��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_STOP), L"ֹͣ�طţ�Video_StopPlayback��ȡ����ȡYUV��");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_RECORD_ISBMP), L"ʹ��ץBMPλͼ����ѡ��ץλͼ������ץJPGͼƬ");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SNAP), L"����ץͼ��Video_Snap��ֻ�д����ϳ��ֳ�����ʱ����ץͼ��Ҳ���յ����ſ�ʼ��Ϣ�����ʹ�ã�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_SNAL_FILE), L"����·���ļ����ƣ���������׺");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_OPENSOUND), L"��������Video_SoundCtrl��ֻ���ڴ����ϳ��ֳ�����ʱ���ܴ�������Ҳ���յ����ſ�ʼ��Ϣ�����ʹ�ã�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_CLOSESOUND), L"�ر�������Video_SoundCtrl��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_VIDEO_DETAIL), L"��ȡ��Ƶ���飨Video_GetVideoInfo�������ֱ��ʡ�������֡�ʡ��������͡���װ���ͣ�ֻ���ڴ����ϳ��ֳ�����ʱ���ܴ�������Ҳ���յ����ſ�ʼ��Ϣ�����ʹ�ã�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_GETVOLUME), L"��ȡ������Video_GetVolume��ֻ�д����������ʹ�ã�������ΧΪ[0 100]��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SETVOLUME), L"����������Video_SetVolume��ֻ�д����������ʹ�ã�������ΧΪ[0 100]��������ΧSDK�ڲ���ʹ�ñ߽�ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_VOLUME), L"����ֵ����ȡ�������ڴ���ʾ");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_VOLUME_TOSET), L"����ֵ����ΧΪ[0 100]��������Χʹ�ñ߽�ֵ");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_X), L"�������ַ��������ĺ�����");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_Y), L"�������ַ���������������");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_FONTSIZE), L"�������ַ������ֺŴ�С��Ĭ��ֵ0��ʾ�ֺ�12��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_R), L"�������ַ�����������ɫR������ȡֵ��Χ[0 255]��������ʹ�ñ߽�ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_G), L"�������ַ�����������ɫG������ȡֵ��Χ[0 255]��������ʹ�ñ߽�ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_B), L"�������ַ�����������ɫB������ȡֵ��Χ[0 255]��������ʹ�ñ߽�ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_ALIGN), L"�����ַ�������ʱ���еĶ��뷽ʽ��0-������� 1-���ж��� 2-���Ҷ��룩");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_TEXT), L"������������ַ�����֧�ֻ���"); 
	_toolTip.AddTool(GetDlgItem(IDC_COMBO_RECORD_OSD_ID), L"��ѡ�����ID����������ѡ��0���޸Ļ�ɾ��ѡ�����0��ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_OSD_BOLD), L"�����Ƿ�Ӵ֣�1-�Ӵ� 0-�ǼӴ� ����ֵ-��������");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SETOSD), L"�����ַ����ӣ�Video_SetOSDText��id��0��ʾ�������ӣ��������Ӻ󷵻ش���0�ĵ���id���޸ĵ���ʱѡ���Ӧ��id���޸ĵ��ӵ��ַ����Ȳ�����ɾ������ʱѡ���Ӧ��id���޸��ַ���Ϊ���ַ������ɣ�����������������");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_LOCALRECORD_TYPE), L"����¼�����ͣ�0-��ͨ����¼�񣨲�ת��װ��ֱ���������ļ���¼���ļ���Ҫʹ��ר�ò��������ţ���SDK�����豸���ص�¼����ʹ�ô󻪲��������ţ�����SDK��EHOME/ISUP��ONVIF��GB28181Э������豸ʹ�ú������������ţ� 1-ת��װ����ֻҪ��Ƶ����Ƶ��֧���򷵻�ʧ�ܣ�������Ϊ��֧�� 2-ת��װ���������Ƶ����Ƶ��֧���򰴲�ת��װ���� 3-ת��װ���������Ƶ��֧����Ƶ֧����ֻת��Ƶ���������֧���򷵻�ʧ�ܣ�������Ϊ��֧�֣�һ����˵������SDK��EHOME/ISUP��ONVIFЭ������豸����Ƶ��֧��ת��װ�ģ�GB28181����SDKЭ������豸����Ƶ�ǲ�֧��ת��װ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_PACKAGESIZE), L"����¼��ְ���С��ָ�ﵽһ����С����������һ���ļ����������ݣ�����λΪ�ֽڣ�ʵ���ļ��Ĵ�С��һ����ָ���Ĵ�С��ȣ����ܴ�һ��Ҳ����Сһ�㣬������������DemoĬ��500MB");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_LOCAL_FILE), L"����¼��ľ���·��¼���ļ����ƣ��������mp4��׺");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_START_LOCALRECORD), L"��������¼��Video_StartLocalRecord��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_STOP_LOCALRECORD), L"ֹͣ����¼��Video_StopLocalRecord��");	
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_PAUSE), L"��ͣ��Video_PlayCtrl��֧��ȡ�������ţ�����ֱ��յ�ȡ����ʼ�����ſ�ʼ��Ϣ�����ʹ��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_RESUME), L"�ָ���Video_PlayCtrl��ȡ����������ͣ��ָ�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_GETTIMESTAMP), L"��ȡ��ǰ����ʱ�����Video_GetCurrentPlayTime���������������ʹ�ã�Ҳ���յ����ſ�ʼ��Ϣ�����ʹ��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SEEK), L"��λ���ţ�Video_PlayCtrl��֧�ֶ�λ���š�ȡ��������ֱ��յ����ſ�ʼ��ȡ����ʼ��Ϣ�����ʹ�ã�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_SPEED), L"���ٲ��ţ�Video_PlayCtrl��֧�ֶ�λ������ȡ��������ֱ��յ����ſ�ʼ��ȡ����ʼ�����ʹ�ã�֧�ֵı���ֵ�У�-16-16�������� -8-8�������� -4-4�������� -2-2�������� 1-�����ٶȲ��� 2-2���ٿ�� 4-4���ٿ�� 8-8���ٿ�� 16-16���ٿ�ţ�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_CUR_PLAYTIMESTAMP), L"��ȡ�ĵ�ǰ����ʱ�����ͨ��Video_GetCurrentPlayTime��ȡ��ʱ�����ʾ������");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_TIMESTAP_TOSEEK), L"��λ���Ż�λȡ��ʱ���������Video_PlayCtrl���ٲ��Ż���ȡ��ʱ�Դ˲�����Ϊ��λ������֧�ֵı���ֵ�У�-16-16�������� -8-8�������� -4-4�������� -2-2�������� 1-�����ٶȲ��� 2-2���ٿ�� 4-4���ٿ�� 8-8���ٿ�� 16-16���ٿ�ţ�Video_PlayCtrl���ٲ��Ż���ȡ��ʱʹ�ô˲���");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_PARAM), L"���ٲ���ȡֵ��֧�ֵı���ֵ�У�-16-16�������� -8-8�������� -4-4�������� -2-2�������� 1-�����ٶȲ��� 2-2���ٿ�� 4-4���ٿ�� 8-8���ٿ�� 16-16���ٿ��");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_RECORD_STARTDATE), L"���ſ�ʼ����");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_RECORD_STARTTIME), L"���ſ�ʼʱ��");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_RECORD_ENDDATE), L"���ſ�ʼ����");
	_toolTip.AddTool(GetDlgItem(IDC_DATETIMEPICKER_RECORD_ENDTIME), L"���ſ�ʼʱ��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_PRIVATE_OPEN), L"��ʾ˽�����ݣ�Video_PrivateDataCtrl����Ժ����豸����Щ�豸�����Ժ���SDK��EHOME/ISUP��ONVIF��GB28181Э����룻����û�������͵�˽�����ݣ���������֮�����ʹ�á�|����ʵ�ֵ�һ�νӿڿ��ƶ�����ͣ��������������͵ģ������������һ��һ�������ƣ����������͵ĸ��������Ϳ���ʹ�á�|��ʵ�ֵ�һ�νӿڿ���ͬһ�����͵Ķ�������ͣ�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_RECORD_PRIVATE_CLOSE), L"����˽�����ݣ�Video_PrivateDataCtrl����Ժ����豸����Щ�豸�����Ժ���SDK��EHOME/ISUP��ONVIF��GB28181Э����룻����û�������͵�˽�����ݣ���������֮�����ʹ�á�|����ʵ�ֵ�һ�νӿڿ��ƶ�����ͣ��������������͵ģ������������һ��һ�������ƣ����������͵ĸ��������Ϳ���ʹ�á�|��ʵ�ֵ�һ�νӿڿ���ͬһ�����͵Ķ�������ͣ�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_MAINTYPE), L"˽�����������ͣ�0x0001-���ܷ��� 0x0002-�ƶ���� 0x0004-POS��Ϣ����� 0x0008-ͼƬ���� 0x0010-�ȳ�����Ϣ 0x0020-�¶���Ϣ��ʮ���������Ϳ�ѡ��ΧΪ1~63��������0x0010���ȳ�����Ϣ���������Ͷ���Ϊ0x0001-������ʾ 0x0002-����¶� 0x0004-����¶�λ�� 0x0008-����¶Ⱦ��루ʮ���������Ϳ�ѡ��ΧΪ1~15��������0x0020���¶���Ϣ���������Ͷ���Ϊ0x0001-����� 0x0002-�߲��� 0x0004-����£�ʮ���������Ϳ�ѡ��ΧΪ1~7��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_RECORD_SUBTYPE), L"˽�����������ͣ�����0x0010���ȳ�����Ϣ���������Ͷ���Ϊ0x0001-������ʾ 0x0002-����¶� 0x0004-����¶�λ�� 0x0008-����¶Ⱦ��루ʮ���������Ϳ�ѡ��ΧΪ1~15��������0x0020���¶���Ϣ���������Ͷ���Ϊ0x0001-����� 0x0002-�߲��� 0x0004-����£�ʮ���������Ϳ�ѡ��ΧΪ1~7��");

	_initData();
}

// CRecordPlay ��Ϣ�������

void CRecordPlayDialog::OnBnClickedButtonRecordStart()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	if (_playHandle > -1)
	{
		_printMsg("��ǰ���ڲ��š�ȡ�����ȡYUV״̬������ֹͣ");
		return;
	}

	CString str;
	GetDlgItemText(IDC_EDIT_RECORD_URL, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"�ط�ȡ��URL����Ϊ��");
		return;
	}
	
	SetDlgItemText(IDC_EDIT_RECORD_STREAM, L"");
	SetDlgItemText(IDC_EDIT_RECORD_YUV, L"");

	CTime ctTemp;
	struct tm tmStart;
	memset(&tmStart, 0, sizeof(tmStart));
	struct tm tmEnd;
	memset(&tmEnd, 0, sizeof(tmEnd));

	_startDate.GetTime(ctTemp);
	tmStart.tm_year = ctTemp.GetYear() - 1900;
	tmStart.tm_mon = ctTemp.GetMonth() - 1;
	tmStart.tm_mday = ctTemp.GetDay();
	_startTime.GetTime(ctTemp);
	tmStart.tm_hour = ctTemp.GetHour();
	tmStart.tm_min = ctTemp.GetMinute();
	tmStart.tm_sec = ctTemp.GetSecond();
	time_t llStartTime = mktime(&tmStart);

	_endDate.GetTime(ctTemp);
	tmEnd.tm_year = ctTemp.GetYear() - 1900;
	tmEnd.tm_mon = ctTemp.GetMonth() - 1;
	tmEnd.tm_mday = ctTemp.GetDay();
	_endTime.GetTime(ctTemp);
	tmEnd.tm_hour = ctTemp.GetHour();
	tmEnd.tm_min = ctTemp.GetMinute();
	tmEnd.tm_sec = ctTemp.GetSecond();
	time_t llEndTime = mktime(&tmEnd);

	bool isUseGpuDecode = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_GPU))->GetCheck();
	bool isAsyn = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISASYN))->GetCheck();
	bool isUseWnd = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEHWND))->GetCheck();
	bool isCbStream = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSESTREAM))->GetCheck();
	bool isCbYUV = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEYUV))->GetCheck();
	bool isCbMsg = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEMSG))->GetCheck();
	HWND hWnd = isUseWnd ? _recordPlayWnd.GetSafeHwnd() : nullptr;

	VIDEO_PLAY_REQ req = { 0 };
	req.pUserData = this;
	req.iHardWareDecode = isUseGpuDecode ? 1 : 0;
	req.fnDecodedStream = isCbYUV ? &CRecordPlayDialog::cb_decodedDataCallback : nullptr;
	req.fnMsg = isCbMsg ? &CRecordPlayDialog::cb_msgCallback : nullptr;
	req.fnStream = isCbStream ? &CRecordPlayDialog::cb_streamCallback : nullptr;	

	USES_CONVERSION;
	std::string url = T2A(str);
	url = StringTrim(url, " ");
	ULONGLONG costs = GetTickCount64();
	_playHandle = isAsyn ? Video_StartAsynPlayback(url.c_str(), hWnd, llStartTime, llEndTime, &req) : Video_StartPlayback(url.c_str(), hWnd, llStartTime, llEndTime, &req);
	costs = GetTickCount64() - costs;
	_printMsg(isAsyn ? "Video_StartAsynPlayback���첽�طţ�" : "Video_StartPlayback��ͬ���طţ�", _playHandle != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordStop()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_StopPlayback(_playHandle);
	costs = GetTickCount64() - costs;
	_playHandle = -1;
	_printMsg("Video_StopPlayback��ֹͣ�طţ�", ret, Video_GetLastError(), costs);

	// ˢ���´���
	_recordPlayWnd.ShowWindow(SW_HIDE);
	_recordPlayWnd.ShowWindow(SW_SHOW);

	SetDlgItemText(IDC_EDIT_RECORD_STREAM, L"");
	SetDlgItemText(IDC_EDIT_RECORD_YUV, L"");

	_osdCombBox.ResetContent();
	_osdCombBox.InsertString(0, L"0");
	_osdCombBox.SetItemData(0, static_cast<DWORD_PTR>(0));
	_osdCombBox.SetCurSel(0);
}

void CRecordPlayDialog::OnBnClickedButtonRecordSnap()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString str;
	GetDlgItemText(IDC_EDIT_RECORD_SNAL_FILE, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"ץͼ���Ʋ���Ϊ��");
		return;
	}

	bool isBmp = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISBMP))->GetCheck();
	str = str + CString(isBmp ? ".bmp" : ".jpg");

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlaySnap(_playHandle, T2A(str));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlaySnap���ط�ץͼ��", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordOpensound()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SoundCtrl(_playHandle, 0);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SoundCtrl����������", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordClosesound()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SoundCtrl(_playHandle, 1);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SoundCtrl���ر�������", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordVideoDetail()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	auto systemTypeTransfunc = [](int systemType) {
		std::string str;
		switch (systemType)
		{
		case 4:
			str = "raw";
			break;
		case 1:
			str = "ps";
			break;
		case 3:
			str = "rtp";
			break;
		case 2:
			str = "ts";
			break;
		case 5:
			str = "rtp+ps";
			break;
		default:
			break;
		}

		return str;
	};

	auto encodeTypeTransfunc = [](int encodeType) {
		std::string str;
		switch (encodeType)
		{
		case 6:
			str = "raw";
			break;
		case 1:
			str = "H.264";
			break;
		case 2:
			str = "ps";
			break;
		case 3:
			str = "mp4";
			break;
		case 4:
			str = "H.265";
			break;
		case 5:
			str = "gb";
			break;
		default:
			break;
		}

		return str;
	};

	VIDEO_DETAIL_INFO info = { 0 };
	char buffer[512] = { 0 };
	ULONGLONG costs = GetTickCount64();
	int ret = Video_GetVideoInfo(_playHandle, &info);
	costs = GetTickCount64() - costs;
	if (VIDEO_ERR_SUCCESS == ret)
	{
		sprintf_s(buffer, "��ȡ��Ƶ���飺���=%d���߶�=%d��֡��=%I64d������=%f����������=%s����װ����=%s��", info.iWidth, info.iHeight, info.i64FrameRate, info.fCodeRate, encodeTypeTransfunc(info.iEncodeType).c_str(), systemTypeTransfunc(info.iEncapsulationType).c_str());
	}

	std::string str = std::string("Video_GetVideoInfo��") + (VIDEO_ERR_SUCCESS == ret ? buffer : "��ȡ��Ƶ���飩");
	_printMsg(str, ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordGetvolume()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_GetVolume(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_GetVolume����ȡ������", ret != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);

	if (ret != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", ret);
		SetDlgItemText(IDC_EDIT_RECORD_VOLUME, str);
	}
}

void CRecordPlayDialog::OnBnClickedButtonRecordSetvolume()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString str;
	GetDlgItemText(IDC_EDIT_PREVIEW_VOLUME_SETVALUE, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"����������ֵ����Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SetVolume(_playHandle, atoi(T2A(str)));
	costs = GetTickCount64() - costs;
	_printMsg("Video_SetVolume������������", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordSetosd()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strR;
	CString strG;
	CString strB;
	CString strIsBold;
	CString strFontSize;
	CString strX;
	CString strY;
	CString strAlignType;
	GetDlgItemText(IDC_EDIT_RECORD_OSD_R, strR);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_G, strG);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_B, strB);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_BOLD, strIsBold);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_FONTSIZE, strFontSize);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_X, strX);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_Y, strY);
	GetDlgItemText(IDC_EDIT_RECORD_OSD_ALIGN, strAlignType);
	if (strR.IsEmpty() || strG.IsEmpty() || strB.IsEmpty() || strIsBold.IsEmpty() || strFontSize.IsEmpty() || strX.IsEmpty() || strY.IsEmpty() || strAlignType.IsEmpty())
	{
		AfxMessageBox(L"�ַ����Ӳ�������Ϊ��");
		return;
	}

	CString strText;
	GetDlgItemText(IDC_EDIT_RECORD_OSD_TEXT, strText);

	int index = _osdCombBox.GetCurSel();
	int osdId = (int)_osdCombBox.GetItemData(index);
	VIDEO_OSD_INFO info = { 0 };
	USES_CONVERSION;
	info.ix = atoi(T2A(strX));
	info.iy = atoi(T2A(strY));
	info.iAlignType = atoi(T2A(strAlignType));
	int r = atoi(T2A(strR));
	int g = atoi(T2A(strG));
	int b = atoi(T2A(strB));
	info.i64Color = RGB(r > 255 ? 255 : (r < 0 ? 0 : r), g > 255 ? 255 : (g < 0 ? 0 : g), b > 255 ? 255 : (b < 0 ? 0 : b));
	info.iFontSize = atoi(T2A(strFontSize));
	info.iBold = atoi(T2A(strIsBold));

	ULONGLONG costs = GetTickCount64();
	int ret = Video_SetOSDText(_playHandle, osdId, T2A(strText), &info);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SetOSDText���ַ����ӣ�", ret > 0 ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);

	if (ret > 0)
	{
		// �״ε���
		if (osdId < 1)
		{
			CString str;
			str.Format(L"%d", ret);
			_osdCombBox.InsertString(ret, str);  // iId ��1��ʼ
			_osdCombBox.SetItemData(ret, static_cast<DWORD_PTR>(ret));
			_osdCombBox.SetCurSel(ret);
			return;
		}

		// ɾ������
		if (strText.IsEmpty())
		{
			_osdCombBox.DeleteString(index);
			_osdCombBox.SetCurSel(0);
		}
	}
}

void CRecordPlayDialog::OnBnClickedButtonRecordStartLocalrecord()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strFile;
	GetDlgItemText(IDC_EDIT_RECORD_LOCAL_FILE, strFile);
	if (strFile.IsEmpty())
	{
		AfxMessageBox(L"����¼���ļ����Ʋ���Ϊ��");
		return;
	}

	CString strType;
	GetDlgItemText(IDC_EDIT_RECORD_LOCALRECORD_TYPE, strType);
	if (strType.IsEmpty())
	{
		AfxMessageBox(L"����¼�����Ͳ���Ϊ��");
		return;
	}

	CString strPackageSize;
	GetDlgItemText(IDC_EDIT_RECORD_PACKAGESIZE, strPackageSize);
	if (strPackageSize.IsEmpty())
	{
		AfxMessageBox(L"����¼��ְ���С����Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAPackageSize = T2A(strPackageSize);
	std::string szAType = T2A(strType);
	int ret = Video_StartLocalRecord(_playHandle, T2A(strFile), atoi(szAPackageSize.c_str()), atoi(szAType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_StartLocalRecord����ʼ����¼��", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordStopLocalrecord()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_StopLocalRecord(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_StopLocalRecord��ֹͣ����¼��", ret > VIDEO_ERR_SUCCESS ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordPause()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlayCtrl(_playHandle, 0, 0);
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlayCtrl����ͣ���Ż���ͣȡ����", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordResume()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlayCtrl(_playHandle, 1, 0);
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlayCtrl���ָ����Ż�ָ�ȡ����", ret, Video_GetLastError(), costs);
}


void CRecordPlayDialog::OnBnClickedButtonRecordGettimestamp()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	VIDEO_INT64 ret = Video_GetCurrentPlayTime(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_GetCurrentPlayTime����ȡ��ǰ����ʱ�����", ret > 0 ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
	if (ret > 0)
	{
		CString str;
		str.Format(L"%lld", ret);
		SetDlgItemText(IDC_EDIT_RECORD_CUR_PLAYTIMESTAMP, str);
	}
}

void CRecordPlayDialog::OnBnClickedButtonRecordSeek()
{	
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString str;
	GetDlgItemText(IDC_EDIT_RECORD_TIMESTAP_TOSEEK, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"��λʱ�������Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlayCtrl(_playHandle, 2, atoll(T2A(str)));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlayCtrl����λ���Ż�λȡ����", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordSpeed()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString str;
	GetDlgItemText(IDC_EDIT_RECORD_PARAM, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"���ٲ����ٶ�ֵ����Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlayCtrl(_playHandle, 3, atoi(T2A(str)));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlayCtrl�����ٲ��Ż���ȡ����", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordPrivateOpen()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strMainType;
	GetDlgItemText(IDC_EDIT_RECORD_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_RECORD_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_playHandle, atoi(szAMainType.c_str()), 0, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl��˽��������ʾ��", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::OnBnClickedButtonRecordPrivateClose()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strMainType;
	GetDlgItemText(IDC_EDIT_RECORD_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_RECORD_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_playHandle, atoi(szAMainType.c_str()), 1, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl��˽���������أ�", ret, Video_GetLastError(), costs);
}

void CRecordPlayDialog::_initData()
{
	// ��Ҫ����һЩ�ؼ�
	((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEHWND))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSESTREAM))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEYUV))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_RECORD_ISUSEMSG))->SetCheck(BST_CHECKED);

	USES_CONVERSION;
	_snapPicFile = A2T(std::string(_exefold + "/playback_picture").c_str());
	_localRecordFile = A2T(std::string(_exefold + "/playback_localRecord.mp4").c_str());
	SetDlgItemText(IDC_EDIT_RECORD_SNAL_FILE, _snapPicFile);
	SetDlgItemText(IDC_EDIT_RECORD_LOCAL_FILE, _localRecordFile);

	_osdCombBox.InsertString(0, L"0");  // iId ��1��ʼ
	_osdCombBox.SetItemData(0, static_cast<DWORD_PTR>(0));
	_osdCombBox.SetCurSel(0);

	SYSTEMTIME stTime;
	GetLocalTime(&stTime);
	stTime.wHour = 0;
	stTime.wSecond = 0;
	stTime.wMinute = 0;
	stTime.wMilliseconds = 0;
	_startDate.SetTime(&stTime);
	_startTime.SetTime(&stTime);
	_endDate.SetTime(&stTime);

	stTime.wHour = 23;
	stTime.wSecond = 59;
	stTime.wMinute = 59;
	stTime.wMilliseconds = 0;
	_endTime.SetTime(&stTime);	
}

void CRecordPlayDialog::_printMsg(const std::string & func, int ret, int errorCode, ULONGLONG costs)
{
	char buffer[512] = { 0 };
	sprintf_s(buffer, "%sִ��%s����ʱ%I64d���룬������Ϊ%d", func.c_str(), ret != VIDEO_ERR_SUCCESS ? "ʧ��" : "�ɹ�", costs, errorCode);

	if (_msgBox.GetCount() > 100)
	{
		_msgBox.ResetContent();
	}

	USES_CONVERSION;
	_msgBox.InsertString(0, A2T(buffer));
    _showListHovScollBar();
}

void CRecordPlayDialog::_printMsg(const std::string& msg)
{
	if (_msgBox.GetCount() > 100)
	{
		_msgBox.ResetContent();
	}

	USES_CONVERSION;
	_msgBox.InsertString(0, A2T(msg.c_str()));
    _showListHovScollBar();
}

void CRecordPlayDialog::_showListHovScollBar()
{
    CDC *pDC = _msgBox.GetDC();
    if (NULL == pDC)
    {
        return;
    }

    int nCount = _msgBox.GetCount();
    if (nCount < 1)
    {
        _msgBox.SetHorizontalExtent(0);
        return;
    }

    int nMaxExtent = 0;
    CString szText;
    for (int i = 0; i < nCount; ++i)
    {
        _msgBox.GetText(i, szText);
        CSize &cs = pDC->GetTextExtent(szText);
        if (cs.cx > nMaxExtent)
        {
            nMaxExtent = cs.cx;
        }
    }

    _msgBox.SetHorizontalExtent(nMaxExtent);
}

void CRecordPlayDialog::cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void * pUserData)
{
	CRecordPlayDialog* pThis = reinterpret_cast<CRecordPlayDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	auto msgTransFunc = [](int msgType) {
		std::string str;
		switch (msgType)
		{
		case 1:
			str = "���ſ�ʼ";
			break;
		case 2:
			str = "���Ž���";
			break;
		case 3:
			str = "�����쳣";
			break;
		case 10:
			str = "ȡ����ʼ";
			break;
		case 11:
			str = "ȡ������";
			break;
		case 12:
			str = "ȡ���쳣";
			break;
		case 13:
			str = "����ȡ����֧��";
			break;
		case 50:
			str = "�첽����ȡ���ɹ�";
			break;
		case 51:
			str = "�첽����ȡ��ʧ��";
			break;
		default:
			str = "δ֪";
			break;
		}

		return str;
	};

	std::string* str = new (std::nothrow) std::string();
	if (str != nullptr)
	{
		*str = "��Ϣ���ͣ�" + msgTransFunc(iMsg);
		pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_MSG, reinterpret_cast<LPARAM>(str));
	}
}

void __stdcall CRecordPlayDialog::cb_streamCallback(VIDEO_INT64 i64PlayHandle, int iStreamDataType, const char* pDataArray, int iDataLen, void* pUserData)
{
	CRecordPlayDialog* pThis = reinterpret_cast<CRecordPlayDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	time_t tmp = time(nullptr);
	if (abs(tmp - pThis->_time4Stream) > 1)
	{
		pThis->_time4Stream = tmp;

		char buffer[1024] = { 0 };
		sprintf_s(buffer, "�����ͣ�%s�������ȣ�%d", 0 == iStreamDataType ? "��ͷ" : (1 == iStreamDataType ? "������" : 2 == iStreamDataType ? "�������" : "δ֪"), iDataLen);
		std::string* str = new (std::nothrow) std::string();
		if (str != nullptr)
		{
			*str = buffer;
			pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_STREAM, reinterpret_cast<LPARAM>(str));
		}
	}
}

void CRecordPlayDialog::cb_decodedDataCallback(VIDEO_INT64 i64PlayHandle, const char * pDataArray, int iDataLen, int iWidth, int iHeight, int iFrameType, int iTimeStamp, void * pUserData)
{
	CRecordPlayDialog* pThis = reinterpret_cast<CRecordPlayDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	time_t tmp = time(nullptr);
	if (abs(tmp - pThis->_time4Yuv) > 1)
	{
		pThis->_time4Yuv = tmp;

		char buffer[1024] = { 0 };
		sprintf_s(buffer, "YUV���ͣ�YV12�������ȣ�%d����ȣ�%d���߶ȣ�%d", iDataLen, iWidth, iHeight);
		std::string* str = new (std::nothrow) std::string();
		if (str != nullptr)
		{
			*str = buffer;
			pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_YUV, reinterpret_cast<LPARAM>(str));
		}
	}
}

LRESULT CRecordPlayDialog::OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam)
{
	std::string* str = reinterpret_cast<std::string*>(lparam);
	if (str != nullptr)
	{
		switch (wparam)
		{
		case CALLBACK_MSG:
		{
			USES_CONVERSION;
			_printMsg(*str);
			SetDlgItemText(IDC_EDIT_RECORD_MSG, A2T((*str).c_str()));
		}
			break;
		case CALLBACK_STREAM:
		{
			USES_CONVERSION;
			_streamInfo = A2T((*str).c_str());
			SetDlgItemText(IDC_EDIT_RECORD_STREAM, _streamInfo);
		}
			break;
		case CALLBACK_YUV:
		{
			USES_CONVERSION;
			_yuvInfo = A2T((*str).c_str());
			SetDlgItemText(IDC_EDIT_RECORD_YUV, _yuvInfo);
		}
			break;
		default:
			break;
		}

		delete str;
	}

	return 0;
}

void CRecordPlayDialog::OnLbnDblclkListPlaybackMsgbox()
{
	int index = _msgBox.GetCurSel();
	if (index < 0)
	{
		return;
	}

	CString str;
	_msgBox.GetText(index, str);
	AfxMessageBox(str, MB_OK | MB_ICONINFORMATION);
}
